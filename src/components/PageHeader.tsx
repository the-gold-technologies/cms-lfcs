import React, { Dispatch, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  action?: {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
  };
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  deleteAction?: {
    label: string;
    onDelete: () => void;
  };
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  actions,
  action,
  setIsOpen,
  deleteAction,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight flex items-center gap-3">
          {title}
          {badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#0E5A60]">
              {badge}
            </span>
          )}
        </h1>
        {description && (
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {deleteAction && (
          <button
            type="button"
            onClick={deleteAction.onDelete}
            className="inline-flex items-center gap-2 px-6 py-3 border border-red-100 text-red-500 font-semibold rounded-full hover:bg-red-50 transition-all cursor-pointer text-sm"
          >
            <Trash2 className="w-4 h-4" />
            {deleteAction.label}
          </button>
        )}

        {action && (
          <button
            type="button"
            onClick={() => {
              if (action.onClick) {
                action.onClick();
              } else {
                setIsOpen?.(true);
              }
            }}
            className="inline-flex items-center gap-2 w-fit px-6 bg-[#0B0F29] text-white font-semibold py-3 rounded-full hover:bg-black transition-all hover:border-[#0E5A60] hover:shadow-[0_0_25px_rgba(14,90,96,0.3)] cursor-pointer text-sm"
          >
            {action.icon ? action.icon : <Plus className="-ml-0.5 h-4 w-4" strokeWidth={3} />}
            {action.label}
          </button>
        )}

        {actions}
        {children}
      </div>
    </header>
  );
}
