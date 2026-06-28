'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface SaveButtonProps {
  type: 'company' | 'investor';
  itemId: string;
  initialSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

export function SaveButton({ type, itemId, initialSaved = false, onSaveChange }: SaveButtonProps) {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggleSave = async () => {
    if (status !== 'authenticated') {
      // Redirect to sign in
      window.location.href = '/api/auth/signin';
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        // Unsave
        const response = await fetch(
          `/api/saved/${type === 'company' ? 'companies' : 'investors'}?${type}_id=${itemId}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          setSaved(false);
          onSaveChange?.(false);
        }
      } else {
        // Save
        const response = await fetch(
          `/api/saved/${type === 'company' ? 'companies' : 'investors'}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [`${type}_id`]: itemId }),
          }
        );

        if (response.ok) {
          setSaved(true);
          onSaveChange?.(true);
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        ${saved 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={saved ? 'Remove from saved' : 'Save for later'}
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          <span>Save</span>
        </>
      )}
    </button>
  );
}
