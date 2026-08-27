import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Palette
} from 'lucide-react';
import { CategoryConfig, ContactCard } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryConfig[];
  cards: ContactCard[];
  onSaveCategories: (updated: CategoryConfig[]) => void;
  onUpdateCardCategory: (oldCategoryName: string, newCategoryName: string) => void;
  onResetCategories: () => void;
}

const PRESET_COLORS = [
  '#0284c7', // Sky Blue
  '#0f766e', // Teal
  '#7c3aed', // Purple
  '#be123c', // Rose
  '#b45309', // Amber
  '#d97706', // Gold / Orange
  '#2563eb', // Royal Blue
  '#ec4899', // Pink
  '#16a34a', // Emerald Green
  '#8b5cf6', // Violet
  '#ea580c', // Dark Orange
  '#475569', // Slate
  '#059669', // Mint / Green
  '#0891b2', // Cyan
  '#e11d48', // Crimson
  '#4f46e5', // Indigo
  '#ca8a04', // Bronze Yellow
  '#6366f1', // Soft Indigo
  '#9333ea', // Fuchsia
  '#db2777', // Magenta
  '#64748b', // Cool Gray
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  cards,
  onSaveCategories,
  onUpdateCardCategory,
  onResetCategories,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#2563eb');
  const [editDesc, setEditDesc] = useState('');

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#0284c7');
  const [newDesc, setNewDesc] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate card counts per category
  const cardCountsByCategory: Record<string, number> = {};
  cards.forEach((c) => {
    const cat = c.category || 'General';
    cardCountsByCategory[cat] = (cardCountsByCategory[cat] || 0) + 1;
  });

  const handleStartEdit = (cat: CategoryConfig) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || '#2563eb');
    setEditDesc(cat.description || '');
  };

  const handleSaveEdit = (cat: CategoryConfig) => {
    if (!editName.trim()) return;

    const oldName = cat.name;
    const newNameTrimmed = editName.trim();

    const updated = categories.map((c) =>
      c.id === cat.id
        ? {
            ...c,
            name: newNameTrimmed,
            color: editColor,
            description: editDesc.trim(),
          }
        : c
    );

    onSaveCategories(updated);

    // If category name was renamed, update any cards that had the old category
    if (oldName !== newNameTrimmed) {
      onUpdateCardCategory(oldName, newNameTrimmed);
    }

    setEditingId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const nameTrimmed = newName.trim();
    // Check if category name already exists
    if (categories.some((c) => c.name.toLowerCase() === nameTrimmed.toLowerCase())) {
      alert(`Category "${nameTrimmed}" already exists.`);
      return;
    }

    const newCategory: CategoryConfig = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: nameTrimmed,
      color: newColor,
      description: newDesc.trim() || undefined,
    };

    onSaveCategories([...categories, newCategory]);
    setNewName('');
    setNewDesc('');
    setIsAddingNew(false);
  };

  const handleDeleteCategory = (cat: CategoryConfig) => {
    const cardCount = cardCountsByCategory[cat.name] || 0;
    if (cardCount > 0) {
      const confirmReassign = confirm(
        `Category "${cat.name}" has ${cardCount} associated contact${
          cardCount === 1 ? '' : 's'
        }.\n\nDo you want to delete this category and move these contacts to "General"?`
      );
      if (!confirmReassign) return;

      onUpdateCardCategory(cat.name, 'General');
    }

    const updated = categories.filter((c) => c.id !== cat.id);
    onSaveCategories(updated);
    setDeleteConfirmId(null);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      id="category-manager-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Customize Categories</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add, customize colors, edit, or reorder contact categorization tags
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-reset-categories"
              onClick={() => {
                if (confirm('Reset categories to default industry taxonomy?')) {
                  onResetCategories();
                }
              }}
              title="Reset to default categories"
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              id="btn-close-category-manager"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Bar / Add New Toggle & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <input
                id="input-search-categories"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {!isAddingNew && (
              <button
                id="btn-show-add-category-form"
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>

          {/* Add New Category Panel */}
          <AnimatePresence>
            {isAddingNew && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateCategory}
                className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-300">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Create New Category
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category Name *
                    </label>
                    <input
                      id="input-new-category-name"
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Venture Capital, Government, AI Research"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Description (Optional)
                    </label>
                    <input
                      id="input-new-category-desc"
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="e.g. Angel investors & LP funds"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Color Swatch Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-500" />
                    Color Palette
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full transition-transform active:scale-90 flex items-center justify-center cursor-pointer ${
                          newColor === c
                            ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110'
                            : 'hover:scale-105'
                        }`}
                      >
                        {newColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                    <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-300 dark:border-slate-700">
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-500">{newColor}</span>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-new-category"
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Category
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Categories List */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Active Categories ({filteredCategories.length})
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredCategories.map((cat) => {
                const count = cardCountsByCategory[cat.name] || 0;
                const isEditing = editingId === cat.id;

                if (isEditing) {
                  return (
                    <div
                      key={cat.id}
                      className="p-3.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-slate-800/90 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Description
                          </label>
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Optional description"
                            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      {/* Color Picker */}
                      <div className="flex flex-wrap gap-1.5 items-center pt-1">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${
                              editColor === c
                                ? 'ring-2 ring-offset-1 ring-slate-900 dark:ring-white scale-110'
                                : 'hover:scale-105'
                            }`}
                          >
                            {editColor === c && <Check className="w-3 h-3 text-white" />}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat)}
                          className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Update
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.color || '#2563eb' }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{cat.name}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {count} {count === 1 ? 'contact' : 'contacts'}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-3 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        title="Edit category"
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        title="Delete category"
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                  No categories found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            {categories.length} total categories across {cards.length} contacts
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
