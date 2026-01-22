<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\IssueUpdate;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if ($request->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return $next($request);
        });
    }

    public function getIssues(Request $request)
    {
        $issues = Issue::with('user')
            ->byCategory($request->input('category'))
            ->byStatus($request->input('status'))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($issues);
    }

    public function updateStatus(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,verified,in_progress,fixed',
        ]);

        if ($issue->status === $validated['status']) {
            return response()->json(['message' => 'Status is already ' . $validated['status']], 422);
        }

        $oldStatus = $issue->status;
        $issue->status = $validated['status'];
        $issue->save();

        IssueUpdate::create([
            'issue_id' => $issue->id,
            'old_status' => $oldStatus,
            'new_status' => $validated['status'],
            'updated_by' => $request->user()->id,
        ]);

        $issue->load('user', 'updates.user');
        return response()->json($issue);
    }

    public function getIssueUpdates(Issue $issue)
    {
        $updates = $issue->updates()->with('user')->orderBy('created_at')->get();
        return response()->json($updates);
    }
}