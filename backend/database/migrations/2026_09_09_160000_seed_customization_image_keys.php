<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        DB::table('customizations')->insertOrIgnore([
            ['key' => 'hero_image', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'size_guide_image', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'about_image', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'story_image_1', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'story_image_2', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'story_image_3', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'story_image_4', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'story_image_5', 'value' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        DB::table('customizations')->whereIn('key', ['hero_image', 'size_guide_image', 'about_image', 'story_image_1', 'story_image_2', 'story_image_3', 'story_image_4', 'story_image_5'])->delete();
    }
};
