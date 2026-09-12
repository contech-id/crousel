<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_manage_own_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::create([
            'slug' => 'test-sandal',
            'name' => 'Test Sandal',
            'category' => 'Slide',
            'target' => 'Unisex',
            'color' => 'Black',
            'availableColors' => ['Black'],
            'images' => ['products/test.jpg'],
            'description' => 'Produk untuk pengujian keranjang.',
            'price' => 'Rp100.000',
            'weight' => 500,
            'features' => ['Nyaman'],
            'availableSizes' => ['40'],
            'availability' => 'Tersedia',
        ]);
        $this->actingAs($user, 'sanctum');

        $created = $this->postJson('/api/v1/cart', [
            'product_id' => $product->id,
            'size' => '40',
            'color' => 'Black',
        ])->assertCreated()
            ->assertJsonPath('data.quantity', 1)
            ->assertJsonPath('data.product.images.0', 'http://localhost/storage/products/test.jpg');

        $itemId = $created->json('data.id');
        $this->getJson('/api/v1/cart')->assertOk()->assertJsonCount(1, 'data.items');
        $this->patchJson('/api/v1/cart/'.$itemId, ['quantity' => 3])
            ->assertOk()
            ->assertJsonPath('data.quantity', 3);
        $this->deleteJson('/api/v1/cart/'.$itemId)->assertOk();
        $this->assertDatabaseEmpty('cart_items');
    }

    public function test_user_cannot_change_another_users_cart_item(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $product = Product::create([
            'slug' => 'private-cart-sandal',
            'name' => 'Private Sandal',
            'category' => 'Slide',
            'target' => 'Unisex',
            'color' => 'Black',
            'availableColors' => ['Black'],
            'images' => [],
            'description' => 'Produk untuk pengujian kepemilikan.',
            'price' => 'Rp100.000',
            'features' => [],
            'availableSizes' => ['40'],
            'availability' => 'Tersedia',
        ]);
        $item = $owner->cartItems()->create([
            'product_id' => $product->id,
            'size' => '40',
            'color' => 'Black',
            'quantity' => 1,
        ]);

        $this->actingAs($other, 'sanctum')
            ->patchJson('/api/v1/cart/'.$item->id, ['quantity' => 2])
            ->assertNotFound();
    }
}
