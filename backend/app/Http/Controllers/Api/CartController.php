<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = CartItem::with('product')->where('user_id', $request->user()->id)->get();
        return response()->json(['data' => ['items' => $items->map(fn (CartItem $item) => $this->present($item, $request))->values()]]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'size' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'max:100'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:99'],
        ]);
        $product = Product::findOrFail($data['product_id']);
        if (! in_array($data['size'], $product->availableSizes ?? [], true)) {
            throw ValidationException::withMessages(['size' => 'Ukuran produk tidak tersedia.']);
        }
        if (! in_array($data['color'], $product->availableColors ?? [], true)) {
            throw ValidationException::withMessages(['color' => 'Warna produk tidak tersedia.']);
        }
        $item = CartItem::firstOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
            'size' => $data['size'],
            'color' => $data['color'],
        ]);
        $item->quantity = min(99, ($item->exists ? $item->quantity : 0) + (int) ($data['quantity'] ?? 1));
        $item->save();
        $item->load('product');
        return response()->json(['message' => 'Produk ditambahkan ke keranjang.', 'data' => $this->present($item, $request)], 201);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorizeItem($request, $cartItem);
        $data = $request->validate(['quantity' => ['required', 'integer', 'min:1', 'max:99']]);
        $cartItem->update(['quantity' => $data['quantity']]);
        $cartItem->load('product');
        return response()->json(['message' => 'Jumlah produk diperbarui.', 'data' => $this->present($cartItem, $request)]);
    }

    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorizeItem($request, $cartItem);
        $cartItem->delete();
        return response()->json(['message' => 'Produk dihapus dari keranjang.']);
    }

    public function clear(Request $request): JsonResponse
    {
        CartItem::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Keranjang dikosongkan.']);
    }

    private function authorizeItem(Request $request, CartItem $item): void
    {
        abort_unless($item->user_id === $request->user()->id, 404);
    }

    private function present(CartItem $item, Request $request): array
    {
        $product = $item->product;
        $productData = $product->toArray();
        $paths = json_decode((string) $product->getRawOriginal('images'), true);
        $productData['images'] = array_values(array_map(function ($path) use ($request): string {
            if (! is_string($path) || Str::startsWith($path, ['http://', 'https://', '/'])) return (string) $path;
            return rtrim($request->getSchemeAndHttpHost(), '/').'/storage/'.ltrim($path, '/');
        }, is_array($paths) ? $paths : []));
        return [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'product' => $productData,
            'size' => $item->size,
            'color' => $item->color,
            'quantity' => $item->quantity,
        ];
    }
}
