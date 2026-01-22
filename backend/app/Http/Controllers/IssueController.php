<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\IssueUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IssueController extends Controller
{

    public function index(Request $request)
    {
        $issues = Issue::with('user')
            ->byCategory($request->input('category'))
            ->byStatus($request->input('status'))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($issues);
    }

    public function show(Issue $issue)
    {
        $issue->load('user', 'updates.user');
        return response()->json($issue);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:road,garbage,flood,light',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'address' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $issueData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address' => $validated['address'],
            'user_id' => $request->user()->id,
        ];

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public');
            $issueData['photo_path'] = $path;
        }

        $issue = Issue::create($issueData);

        return response()->json($issue, 201);
    }

    public function update(Request $request, Issue $issue)
    {
        $this->authorize('update', $issue);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|in:road,garbage,flood,light',
        ]);

        $issue->update($validated);

        return response()->json($issue);
    }

    public function destroy(Issue $issue)
    {
        $this->authorize('delete', $issue);

        if ($issue->photo_path) {
            Storage::disk('public')->delete($issue->photo_path);
        }

        $issue->delete();

        return response()->json(['message' => 'Issue deleted successfully']);
    }
}