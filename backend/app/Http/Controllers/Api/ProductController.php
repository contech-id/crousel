<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->latest();

        if ($request->filled('category')) {
            $query->where('category', $request->string('category')->toString());
        }

        return response()->json(['data' => $query->get()]);
    }

    public function byCategory(string $category): JsonResponse
    {
        return response()->json([
            'data' => Product::query()
                ->where('category', $category)
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $product = Product::create($this->validatedData($request));

        return response()->json([
            'message' => 'Produk berhasil dibuat.',
            'data' => ['product' => $product],
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['data' => ['product' => $product]]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $product->update($this->validatedData($request, $product));

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'data' => ['product' => $product->fresh()],
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
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
            'images.*' => ['string', 'max:2048'],
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
}
