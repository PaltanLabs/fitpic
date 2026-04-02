"use client";

import { useState } from "react";

function todayDDMMYYYY(): string {
  return new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
}

interface Props {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onStampChange: (stamp: { name: string; date: string } | undefined) => void;
}

export default function DateStamper({ enabled, onToggle, onStampChange }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(todayDDMMYYYY());

  const emitChange = (n: string, d: string, on: boolean) => {
    if (on && n && d) {
      onStampChange({ name: n, date: d });
    } else {
      onStampChange(undefined);
    }
  };

  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    emitChange(name, date, checked);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    emitChange(val, date, enabled);
  };

  const handleDateChange = (val: string) => {
    setDate(val);
    emitChange(name, val, enabled);
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-4 space-y-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-yellow-400 focus:ring-yellow-400"
        />
        <span className="text-neutral-200 text-sm font-medium">
          Add Name & Date Stamp
        </span>
      </label>

      {enabled && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your full name (e.g. Siddhartha Bose)"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm placeholder-neutral-500 focus:border-yellow-400 focus:outline-none"
          />

          <div>
            <label className="text-neutral-400 text-xs block mb-1">
              Date on stamp (date photo was taken)
            </label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm placeholder-neutral-500 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Preview of stamp format */}
          {name && date && (
            <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
              <p className="text-neutral-400 text-xs mb-1.5">Stamp preview:</p>
              <div className="bg-white rounded px-3 py-2 text-center">
                <span className="text-black text-sm font-bold">
                  {name} | {date}
                </span>
              </div>
              <p className="text-neutral-600 text-xs mt-1.5">
                Appears below your photo as a white strip
              </p>
            </div>
          )}

          {!name && (
            <p className="text-neutral-400 text-xs">
              SSC and RRB exams require your name and date of photograph below the photo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
