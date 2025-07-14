import { getAuthProviderByProviderId } from '@/lib/arcade/auth-providers';
import { cn } from '@/lib/utils';
import type { AuthorizationResponse } from '@arcadeai/arcadejs/resources/shared.mjs';
import type { ToolInvocation } from 'ai';
import { AlertCircle, CheckCircle2, LockIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useLayoutEffect } from 'react';
import { ToolArcadeAuthorizationLoading } from './tool-arcade-authorization-loading';
import { ToolArcadeError } from './tool-arcade-error';
import { Button, buttonVariants } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToolExecution } from '@/lib/arcade/hooks/use-tool-execution';
import {
  ARCADE_TOOLS_WITH_HUMAN_IN_THE_LOOP,
  ToolWithHumanInTheLoop,
} from './arcade-tool-calls/tool-with-human-in-the-loop';

type ToolArcadeAuthorizationProps = {
  toolInvocation: ToolInvocation;
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    result: any;
  }) => void;
};

export const ToolArcadeAuthorization = ({
  toolInvocation,
  addToolResult,
}: ToolArcadeAuthorizationProps) => {
  const { args } = toolInvocation;
  const needsHumanInTheLoop = ARCADE_TOOLS_WITH_HUMAN_IN_THE_LOOP.includes(
    toolInvocation.toolName,
  );
  const windowOpened = useRef<boolean>(false);
  const [authResponse, setAuthResponse] =
    useState<AuthorizationResponse | null>(null);
  const [countdown, setCountdown] = useState(3);

  const { error } = useToolExecution({
    toolInvocation,
    addToolResult,
    setAuthResponse,
    needsHumanInTheLoop,
  });

  useLayoutEffect(() => {
    if (
      authResponse?.status === 'pending' &&
      authResponse?.url &&
      !windowOpened.current
    ) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!windowOpened.current) {
              window.open(authResponse.url, '_blank');
              windowOpened.current = true;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [authResponse?.url, authResponse?.status]);

  if (needsHumanInTheLoop) {
    return (
      <ToolWithHumanInTheLoop
        toolInvocation={toolInvocation}
        addToolResult={addToolResult}
      />
    );
  }

  if (error) {
    return <ToolArcadeError toolInvocation={toolInvocation} error={error} />;
  }

  if (!authResponse) {
    return <ToolArcadeAuthorizationLoading toolInvocation={toolInvocation} />;
  }

  const authProvider = getAuthProviderByProviderId(authResponse.provider_id);
  const authProviderName = authProvider?.name ?? authResponse.provider_id;

  const Icon = authProvider?.icon ?? LockIcon;

  if (authResponse.status === 'completed') {
    return (
      <Card className="dark:border-green-950 border-green-100">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'flex-shrink-0 p-2 rounded-full',
                  'bg-green-50 dark:bg-green-950/50',
                )}
              >
                <Icon className="size-5 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-card-foreground">
                  Successfully Connected
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your {authProviderName} account is now connected
                </p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div
            className={cn(
              'rounded-md p-3 text-xs',
              'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300',
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              <span>
                Your connection is ready! The tool will be executed in a few
                seconds.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (authResponse.status === 'failed') {
    return (
      <Card className="dark:border-red-950 border-red-100">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'flex-shrink-0 p-2 rounded-full',
                  'bg-red-50 dark:bg-red-950/50',
                )}
              >
                <AlertCircle className="size-5 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-card-foreground">
                  Authorization Failed
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  We couldn&apos;t complete the authorization with{' '}
                  {authProviderName}
                </p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {args.authInfo.url && (
            <Link
              href={args.authInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button variant="outline" size="sm" className="w-full">
                Try again
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  if (authResponse.status === 'pending') {
    return (
      <Card key={`auth-card-${toolInvocation.toolCallId}`}>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-medium">
                  Authorize {authProviderName}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Required to continue
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href={authResponse.url ?? ''}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'w-full flex items-center justify-center gap-2',
              'bg-orange-50/50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/40',
              'border-orange-200 dark:border-orange-800',
              'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
              'shadow-sm hover:shadow-md',
            )}
          >
            <Icon className="size-4" />
            <span>
              {countdown > 0
                ? `Opening in ${countdown}s...`
                : 'Open Authorization Page'}
            </span>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return null;
};
