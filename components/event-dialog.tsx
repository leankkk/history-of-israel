"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CATEGORIA_INFO, type EventoHistorico, type Stats } from "@/lib/game-data"
import { AlertTriangle, Swords } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventDialogProps {
  evento: EventoHistorico | null
  stats: Stats
  onResolver: (e: EventoHistorico) => void
}

export function EventDialog({ evento, stats, onResolver }: EventDialogProps) {
  if (!evento) return null

  const valor = stats[evento.statClave]
  const victoria = valor >= evento.umbral
  const progreso = Math.min((valor / evento.umbral) * 100, 100)
  const nombreStat = CATEGORIA_INFO[evento.statClave].nombre

  return (
    <Dialog open={!!evento}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-destructive/15 text-destructive">
              <Swords className="size-5" aria-hidden />
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              {evento.anio}
            </span>
          </div>
          <DialogTitle className="text-balance text-xl">
            {evento.titulo}
          </DialogTitle>
          <DialogDescription className="text-pretty leading-relaxed">
            {evento.descripcion}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {nombreStat} requerida: {evento.umbral}
            </span>
            <span
              className={cn(
                "font-mono font-semibold tabular-nums",
                victoria ? "text-accent" : "text-destructive",
              )}
            >
              {Math.round(valor)} / {evento.umbral}
            </span>
          </div>
          <Progress
            value={progreso}
            className={cn(
              "h-2 bg-muted",
              victoria ? "[&>div]:bg-accent" : "[&>div]:bg-destructive",
            )}
          />
          <div
            className={cn(
              "mt-3 flex items-start gap-2 text-sm",
              victoria ? "text-accent" : "text-destructive",
            )}
          >
            {victoria ? (
              <p className="leading-relaxed">
                Tu {nombreStat.toLowerCase()} es suficiente. ¡La nación supera la
                crisis y gana influencia!
              </p>
            ) : (
              <>
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p className="leading-relaxed">
                  Tu {nombreStat.toLowerCase()} es insuficiente. Sobrevivirás, pero
                  con grandes pérdidas y poca influencia.
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => onResolver(evento)}
          variant={victoria ? "default" : "destructive"}
          className="w-full"
        >
          {victoria ? "Afrontar la crisis" : "Resistir como sea"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
