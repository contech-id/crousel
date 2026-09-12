<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialMediaLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocialMediaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => SocialMediaLink::query()->orderBy('platform')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $link = SocialMediaLink::create($this->validated($request));
        return response()->json(['message' => 'Link sosial media berhasil ditambahkan.', 'data' => ['social_media' => $link]], 201);
    }

    public function update(Request $request, SocialMediaLink $socialMedia): JsonResponse
    {
        $socialMedia->update($this->validated($request));
        return response()->json(['message' => 'Link sosial media berhasil diperbarui.', 'data' => ['social_media' => $socialMedia->fresh()]]);
    }

    public function destroy(SocialMediaLink $socialMedia): JsonResponse
    {
        $socialMedia->delete();
        return response()->json(['message' => 'Link sosial media berhasil dihapus.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'platform' => ['required', 'string', 'max:50'],
            'account_name' => ['required', 'string', 'max:150'],
            'url' => ['required', 'url', 'max:500'],
        ]);
    }
}
