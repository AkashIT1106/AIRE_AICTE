import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card className="max-w-md w-full shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-card-subdued)] text-[var(--brand-primary)] mb-2">
            <FileQuestion className="h-6 w-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            Page Not Found (HTTP 404)
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-muted)]">
            The requested institutional URL does not exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-[var(--text-secondary)]">
          Please verify the web address or return to your authorized platform
          workspace.
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Link to="/">
            <Button variant="default" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span>Return to Platform Home</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
