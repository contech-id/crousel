<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductCategoryController extends Controller
{
    private const ALLOWED_NAMES = ['unisex', 'kids', 'women', 'men', 'wedges', 'slop', 'slides'];

    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => ProductCategory::query()->orderBy('name')->get()->map(fn (ProductCategory $category): array => $this->presentCategory($category, $request))]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedData($request);
        $data['image'] = $this->storeImage($request);
        $category = ProductCategory::create($data);

        return response()->json([
            'message' => 'Kategori produk berhasil dibuat.',
            'data' => ['category' => $this->presentCategory($category, $request)],
        ], 201);
    }

    public function show(Request $request, ProductCategory $category): JsonResponse
    {
        return response()->json(['data' => ['category' => $this->presentCategory($category, $request)]]);
    }

    public function update(Request $request, ProductCategory $category): JsonResponse
    {
        $data = $this->validatedData($request, $category);
        if ($request->hasFile('image')) {
            $this->deleteImage($category->image);
            $data['image'] = $this->storeImage($request);
        }
        $category->update($data);

        return response()->json([
            'message' => 'Kategori produk berhasil diperbarui.',
            'data' => ['category' => $this->presentCategory($category->fresh(), $request)],
        ]);
    }

    public function destroy(ProductCategory $category): JsonResponse
    {
        $this->deleteImage($category->image);
        $category->delete();

        return response()->json(['message' => 'Kategori produk berhasil dihapus.']);
    }

    /** @return array<string, mixed> */
    private function validatedData(Request $request, ?ProductCategory $category = null): array
    {
        $required = $category === null ? 'required' : 'sometimes';

        return $request->validate([
            'name' => [
                $required,
                'string',
                Rule::in(self::ALLOWED_NAMES),
                Rule::unique('product_categories', 'name')->ignore($category?->id),
            ],
            'example_products' => [$required, 'string', 'max:2000'],
            'image' => [$category === null ? 'required' : 'sometimes', 'file', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
        ]);
    }

    private function storeImage(Request $request): ?string
    {
        $image = $request->file('image');
        return $image ? $image->store('categories', 'public') : null;
    }

    private function deleteImage(?string $path): void
    {
        if ($path && Str::startsWith($path, 'categories/')) {
            Storage::disk('public')->delete($path);
        }
    }

    /** @return array<string, mixed> */
    private function presentCategory(ProductCategory $category, Request $request): array
    {
        $data = $category->toArray();
        $data['image'] = $category->image
            ? rtrim($request->getSchemeAndHttpHost(), '/') . '/storage/' . ltrim($category->image, '/')
            : null;
        return $data;
    }
}
