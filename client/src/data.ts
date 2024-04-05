import { useState } from 'react';
import { useEffect } from 'react';
export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

type UseEntriesValues = {
  error?: unknown;
  entries?: Entry[];
  addEntry: (Entry: Entry) => Promise<void>;
  modifyEntry: (Entry: Entry) => Promise<void>;
  removeEntry: (EntryId: number) => void;
};
export function useEntries(): UseEntriesValues {
  const [entries, setEntries] = useState<Entry[]>();
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    async function effect() {
      try {
        if (entries === undefined) {
          const entries = await readEntries();
          setEntries(entries);
        }
      } catch (err) {
        setError(err);
      }
    }
    effect();
  }, [entries]);
  async function addEntry(newEntry: Entry): Promise<void> {
    try {
      const res = await createEntry(newEntry);
      const newArr = entries?.concat(res);
      setEntries(newArr);
    } catch (err) {
      setError(err);
    }
  }
  async function modifyEntry(Entry: Entry): Promise<void> {
    try {
      const res = await editEntry(Entry);
      const newArr = entries?.map((e) => {
        if (e.entryId === res.entryId) {
          return res;
        } else {
          return e;
        }
      });
      setEntries(newArr);
    } catch (err) {
      setError(err);
    }
  }

  async function removeEntry(EntryId: number) {
    try {
      await deleteEntry(EntryId);
    } catch (err) {
      setError(err);
    }
  }
  return {
    error,
    entries,
    addEntry,
    modifyEntry,
    removeEntry,
  };
}
export async function readEntry(entryId: number) {
  const res = await fetch(`/api/entries/${entryId}`);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  const resJSON = await res.json();
  return resJSON;
}
export async function readEntries(): Promise<Entry[]> {
  const res = await fetch('/api/entries');
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
async function createEntry(Entry: Entry): Promise<Entry> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Entry),
  };
  const res = await fetch('/api/entries', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
async function editEntry(Entry: Entry) {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Entry),
  };
  const res = await fetch(`/api/entries/${Number(Entry.entryId)}`, req);

  return await res.json();
}
async function deleteEntry(EntryId: number) {
  const req = {
    method: 'DELETE',
  };
  const res = await fetch(`/api/entries/${EntryId}`, req);
  console.log(await res.json());
}
