<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->latest();

        if ($request->filled('category')) {
            $this->applyCategoryFilter($query, $request->string('category')->toString());
        }

        return response()->json(['data' => $query->get()->map(fn (Product $product): array => $this->presentProduct($product, $request))]);
    }

    public function byCategory(Request $request, string $category): JsonResponse
    {
        return response()->json([
            'data' => $this->applyCategoryFilter(Product::query(), $category)
                ->latest()
                ->get()
                ->map(fn (Product $product): array => $this->presentProduct($product, $request)),
        ]);
    }

    private function applyCategoryFilter($query, string $category)
    {
        $filters = [
            'slides' => ['field' => 'category', 'value' => 'Slide'],
            'slide' => ['field' => 'category', 'value' => 'Slide'],
            'slop' => ['field' => 'category', 'value' => 'Slop'],
            'wedges' => ['field' => 'category', 'value' => 'Wedges'],
            'unisex' => ['field' => 'target', 'value' => 'Unisex'],
            'kids' => ['field' => 'target', 'value' => 'Kids'],
            'women' => ['field' => 'target', 'value' => 'Women'],
            'men' => ['field' => 'target', 'value' => 'Men'],
        ];
        $filter = $filters[strtolower($category)] ?? ['field' => 'category', 'value' => $category];

        return $query->where($filter['field'], $filter['value']);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);
        $data['images'] = $this->storeImages($request);
        $product = Product::create($data);

        return response()->json([
            'message' => 'Produk berhasil dibuat.',
            'data' => ['product' => $this->presentProduct($product, $request)],
        ], 201);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        return response()->json(['data' => ['product' => $this->presentProduct($product, $request)]]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $this->validatedData($request, $product);

        $currentImages = json_decode((string) $product->getRawOriginal('images'), true);
        if (!is_array($currentImages)) $currentImages = [];

        $imagesChanged = false;

        if ($request->has('deletedImages') && is_array($request->input('deletedImages'))) {
            $deletedUrls = $request->input('deletedImages');
            foreach ($currentImages as $key => $path) {
                $presentedUrl = $this->presentImagePath($path, $request);
                if (in_array($presentedUrl, $deletedUrls) || in_array($path, $deletedUrls)) {
                    if (is_string($path) && Str::startsWith($path, 'products/')) {
                        Storage::disk('public')->delete($path);
                    }
                    unset($currentImages[$key]);
                    $imagesChanged = true;
                }
            }
            $currentImages = array_values($currentImages);
        }

        if (array_key_exists('images', $data) && is_array($data['images'])) {
            $newImages = $this->storeImages($request);
            $currentImages = array_merge($currentImages, $newImages);
            $imagesChanged = true;
        }

        if ($imagesChanged) {
            if (count($currentImages) === 0) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'images' => ['Produk harus memiliki setidaknya 1 gambar.']
                ]);
            }
            $data['images'] = $currentImages;
        }

        $product->update($data);

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'data' => ['product' => $this->presentProduct($product->fresh(), $request)],
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->deleteImages($product);
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedData(Request $request, ?Product $product = null): array
    {
        $required = $product === null ? 'required' : 'sometimes';

        return $request->validate([
            'slug' => [$required, 'string', 'max:150', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('products', 'slug')->ignore($product?->id)],
            'name' => [$required, 'string', 'max:150'],
            'category' => [$required, 'string', Rule::in(['Slide', 'Slop', 'Wedges'])],
            'target' => [$required, 'string', Rule::in(['Women', 'Men', 'Unisex', 'Kids'])],
            'color' => [$required, 'string', 'max:255'],
            'availableColors' => [$required, 'array', 'min:1'],
            'availableColors.*' => ['string', 'max:100'],
            'images' => [$required, 'array', 'min:1'],
            'images.*' => ['file', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'deletedImages' => ['sometimes', 'array'],
            'deletedImages.*' => ['string'],
            'description' => [$required, 'string'],
            'price' => [$required, 'string', 'max:50'],
            'weight' => [$required, 'integer', 'min:1', 'max:100000'],
            'features' => [$required, 'array'],
            'features.*' => ['string', 'max:255'],
            'availableSizes' => [$required, 'array', 'min:1'],
            'availableSizes.*' => ['string', 'max:30'],
            'availability' => [$required, 'string', Rule::in(['Tersedia', 'Pre-order', 'Habis'])],
        ]);
    }

    /**
     * Store uploaded product images on the public disk and return database paths.
     *
     * @return list<string>
     */
    private function storeImages(Request $request): array
    {
        return collect($request->file('images', []))
            ->filter(fn ($image): bool => $image instanceof UploadedFile)
            ->map(fn (UploadedFile $image): string => $image->store('products', 'public'))
            ->values()
            ->all();
    }

    private function deleteImages(Product $product): void
    {
        $paths = json_decode((string) $product->getRawOriginal('images'), true);
        if (!is_array($paths)) {
            return;
        }

        foreach ($paths as $path) {
            // Only remove files created by this endpoint; preserve legacy/external URLs.
            if (is_string($path) && Str::startsWith($path, 'products/')) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    private function presentImagePath($path, Request $request): string
    {
        if (!is_string($path) || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return (string) $path;
        }

        return rtrim($request->getSchemeAndHttpHost(), '/') . '/storage/' . ltrim($path, '/');
    }

    /**
     * Return a serialized product with browser-ready image URLs.
     *
     * @return array<string, mixed>
     */
    private function presentProduct(Product $product, Request $request): array
    {
        $data = $product->toArray();
        $paths = json_decode((string) $product->getRawOriginal('images'), true);
        $paths = is_array($paths) ? $paths : [];
        $data['images'] = array_values(array_map(fn ($path) => $this->presentImagePath($path, $request), $paths));

        return $data;
    }
}
