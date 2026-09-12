<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialMediaLink;
use App\Models\StoreSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'message' => ['required', 'string', 'max:2000'],
        ]);
        $setting = StoreSetting::find(1);
        $recipient = SocialMediaLink::query()->whereRaw('LOWER(platform) = ?', ['email'])->value('account_name')
            ?: ($setting?->store_email ?: config('mail.from.address'));
        Mail::raw("Nama: {$data['name']}\nEmail: {$data['email']}\n\n{$data['message']}", function ($mail) use ($recipient, $data): void {
            $mail->to($recipient)->replyTo($data['email'], $data['name'])->subject('Pesan Pusat Bantuan Crousel');
        });
        return response()->json(['message' => 'Pesan berhasil dikirim.']);
    }
}
