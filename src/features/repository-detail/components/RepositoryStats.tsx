import { Eye, GitFork, Star, CircleDot } from "lucide-react";
import { formatNumber } from "@/shared/lib/format-number";
import type { RepositoryDetailViewModel } from "../types";

type RepositoryStatsProps = {
  repository: RepositoryDetailViewModel;
};

export function RepositoryStats({ repository }: RepositoryStatsProps) {
  const stats = [
    { icon: Star, label: "Stars", value: repository.stars },
    { icon: Eye, label: "Watchers", value: repository.watchers },
    { icon: GitFork, label: "Forks", value: repository.forks },
    { icon: CircleDot, label: "Open Issues", value: repository.openIssues },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="font-medium text-foreground">
            {formatNumber(value)}
          </span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
