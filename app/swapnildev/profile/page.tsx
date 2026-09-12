"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { User, Check, Sparkles, BookOpen, Plus, Trash2 } from "lucide-react";

export default function AdminProfilePage() {
  const { education, updateEducation, settings, updateSettings } = useData();
  const [eduData, setEduData] = useState(education);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEduData(education);
  }, [education]);

  const updateEduField = (field: string, val: any) => {
    const updated = { ...eduData, [field]: val };
    setEduData(updated);
    updateEducation(updated); // IMMEDIATE AUTO-SAVE
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddCourse = () => {
    const course = prompt("Enter course title:");
    if (course) {
      const updated = {
        ...eduData,
        coursework: [...eduData.coursework, course],
      };
      setEduData(updated);
      updateEducation(updated); // IMMEDIATE AUTO-SAVE
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRemoveCourse = (index: number) => {
    const updated = {
      ...eduData,
      coursework: eduData.coursework.filter((_, i) => i !== index),
    };
    setEduData(updated);
    updateEducation(updated); // IMMEDIATE AUTO-SAVE
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Profile & Academic Foundation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Edit scholastic credentials, university details, and specialized research interests. All edits save immediately!
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 rounded-full text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Auto-Save Active // Instant Sync</span>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 text-xs font-mono">
        <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
          <div className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
            Academic Degree & Institution
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400">Degree Title</label>
              <input
                type="text"
                value={eduData.degree}
                onChange={(e) => updateEduField("degree", e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Institution</label>
              <input
                type="text"
                value={eduData.institution}
                onChange={(e) => updateEduField("institution", e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400">Academic Period</label>
              <input
                type="text"
                value={eduData.period}
                onChange={(e) => updateEduField("period", e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Location</label>
              <input
                type="text"
                value={eduData.location}
                onChange={(e) => updateEduField("location", e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Description / Focus</label>
            <textarea
              rows={3}
              value={eduData.description}
              onChange={(e) => updateEduField("description", e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Coursework */}
        <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="text-sm font-bold text-white font-sans">
              Relevant Engineering Coursework
            </div>
            <button
              type="button"
              onClick={handleAddCourse}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {eduData.coursework.map((course, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#0a0c10] border border-slate-800 rounded text-slate-300 flex items-center gap-2"
              >
                <span>{course}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCourse(idx)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
