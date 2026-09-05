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
            $query->where('category', $request->string('category')->toString());
        }

        return response()->json(['data' => $query->get()->map(fn (Product $product): array => $this->presentProduct($product, $request))]);
    }

    public function byCategory(Request $request, string $category): JsonResponse
    {
        return response()->json([
            'data' => Product::query()
                ->where('category', $category)
                ->latest()
                ->get()
                ->map(fn (Product $product): array => $this->presentProduct($product, $request)),
        ]);
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
        if (array_key_exists('images', $data)) {
            $newImages = $this->storeImages($request);
            $this->deleteImages($product);
            $data['images'] = $newImages;
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
            'category' => [$required, 'string', 'max:100'],
            'target' => [$required, 'string', Rule::in(['Women', 'Men', 'Unisex', 'Kids'])],
            'model' => [$required, 'string', 'max:150'],
            'color' => [$required, 'string', 'max:100'],
            'availableColors' => [$required, 'array', 'min:1'],
            'availableColors.*' => ['string', 'max:100'],
            'images' => [$required, 'array', 'min:1'],
            'images.*' => ['file', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'shortDescription' => [$required, 'string', 'max:1000'],
            'description' => [$required, 'string'],
            'price' => [$required, 'string', 'max:50'],
            'material' => [$required, 'string', 'max:1000'],
            'features' => [$required, 'array'],
            'features.*' => ['string', 'max:255'],
            'availableSizes' => [$required, 'array', 'min:1'],
            'availableSizes.*' => ['string', 'max:30'],
            'sandalLength' => [$required, 'string', 'max:100'],
            'footLengthRecommendation' => [$required, 'string', 'max:100'],
            'width' => ['sometimes', 'nullable', 'string', 'max:100'],
            'wedgeHeight' => ['sometimes', 'nullable', 'string', 'max:100'],
            'packagingWeight' => ['sometimes', 'nullable', 'string', 'max:100'],
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
        $data['images'] = array_values(array_map(function ($path) use ($request): string {
            if (!is_string($path) || Str::startsWith($path, ['http://', 'https://', '/'])) {
                return (string) $path;
            }

            return rtrim($request->getSchemeAndHttpHost(), '/') . '/storage/' . ltrim($path, '/');
        }, $paths));

        return $data;
    }
}
