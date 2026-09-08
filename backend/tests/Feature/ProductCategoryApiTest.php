<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\ProductCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductCategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_can_be_listed_publicly(): void
    {
        $this->getJson('/api/v1/categories')
            ->assertOk()
            ->assertJsonCount(7, 'data');
    }

    public function test_admin_can_create_update_and_delete_a_category(): void
    {
        Storage::fake('public');
        $admin = Admin::create([
            'name' => 'Test Admin',
            'username' => 'testadmin',
            'email' => 'admin-test@example.com',
            'password' => 'secret123',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $this->actingAs($admin, 'sanctum');
        ProductCategory::where('name', 'unisex')->delete();

        $response = $this->post('/api/v1/admin/categories', [
            'name' => 'unisex',
            'example_products' => 'Serxes, Santos.',
            'image' => UploadedFile::fake()->createWithContent('category.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')),
        ], ['Accept' => 'application/json']);
        $response->assertCreated();
        $this->assertNotNull($response->json('data.category.image'));
        $created = $response->json('data.category');
        $this->assertCount(1, Storage::disk('public')->allFiles('categories'));

        $this->patchJson('/api/v1/admin/categories/'.$created['id'], [
            'example_products' => 'Serxes, Santos, Chester.',
        ])->assertOk()->assertJsonPath('data.category.example_products', 'Serxes, Santos, Chester.');

        $this->deleteJson('/api/v1/admin/categories/'.$created['id'])->assertOk();
        $this->assertDatabaseMissing('product_categories', ['id' => $created['id']]);
    }

    public function test_category_name_must_be_an_allowed_unique_value(): void
    {
        $admin = Admin::create([
            'name' => 'Test Admin',
            'username' => 'validationadmin',
            'email' => 'validation-admin@example.com',
            'password' => 'secret123',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $this->actingAs($admin, 'sanctum');

        $this->postJson('/api/v1/admin/categories', [
            'name' => 'formal',
            'example_products' => 'Example.',
        ])->assertUnprocessable()->assertJsonValidationErrors('name');
    }
}
