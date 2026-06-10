"use client"

import { Button } from "@/components/ui/button"
import { Flag, Shield, Coins, Handshake, Users } from "lucide-react"

export function IntroScreen({ onIniciar }: { onIniciar: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
          <Flag className="size-8" aria-hidden />
        </span>

        <div className="space-y-3">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            14 de mayo de 1948
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Génesis: La Nación
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Acabas de declarar la independencia. Desde un pequeño territorio
            rodeado de adversarios, deberás construir un Estado capaz de
            sobrevivir a la historia: la Guerra de Independencia, los Seis Días,
            Yom Kipur y el camino hacia la Nación Startup del año 2000.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Shield, label: "Militar" },
            { icon: Coins, label: "Economía" },
            { icon: Handshake, label: "Diplomacia" },
            { icon: Users, label: "Sociedad" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3"
            >
              <Icon className="size-5 text-muted-foreground" aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          <p>
            El tiempo avanza solo y generas{" "}
            <span className="font-medium text-accent">Influencia</span>. Inviértela
            en mejoras para subir tus estadísticas{" "}
            <span className="font-medium text-foreground">antes</span> de que llegue
            cada guerra. Si no estás preparado, la nación sufrirá.
          </p>
        </div>

        <Button size="lg" onClick={onIniciar} className="w-full sm:w-auto">
          Fundar el Estado
        </Button>
      </div>
    </main>
  )
}
