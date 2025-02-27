import { cn } from '~/lib/utils/shadcn-utils'
import { Card, CardContent, CardFooter } from '~/components/ui/card'

interface MessageProps {
  content: string
  userRole: 'user' | 'assistant'
  timestamp?: string
  isLoading?: boolean
}

export function Message({
  content,
  userRole: role,
  timestamp,
  isLoading,
}: MessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <Card
        className={cn(
          'w-8/12 max-w-full relative gap-2',
          isUser
            ? 'bg-primary/80 text-primary-foreground'
            : 'bg-muted text-muted-foreground',
          'shadow-md',
          isLoading && 'animate-pulse bg-muted/50',
        )}
      >
        <CardContent className="p-3 space-y-1 py-4">
          <div className="text-sm break-words whitespace-pre-wrap text-pretty">
            {content}
          </div>
        </CardContent>
        <CardFooter className="absolute bottom-0 right-0 p-2 pt-0 text-xs">
          <span>{timestamp}</span>
        </CardFooter>
      </Card>
    </div>
  )
}
