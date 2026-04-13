"use client";

import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";

import { EventLogo } from "../components/event-logo";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import { KitSlider } from "@/components/kit-slider";
import { BackgroundWrapper } from "@/components/background-wrapper";
import { InscricaoStats } from "@/components/inscricao-stats";
import { formatarMoeda } from "@/lib/utils";
import { useLoteVigente } from "@/hooks/useLoteVigente";
import { FALLBACK_PREMIOS } from "@/lib/evento-home-defaults";
import { HomePremiosGrid } from "@/components/home-premios";
import type { ModalidadeCard } from "@/types/evento-home";

function modalidadeShell(m: ModalidadeCard) {
  const isPurple = m.theme === "purple";
  const card =
    "hover:scale-105 transition-transform duration-300 " +
    (isPurple
      ? "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/25 border-2 border-indigo-300 dark:border-indigo-700"
      : "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/25 dark:to-violet-900/20 border-2 border-violet-300 dark:border-violet-700");
  const header = isPurple
    ? "bg-gradient-to-r from-indigo-800 to-indigo-950 text-white"
    : "bg-gradient-to-r from-violet-500 to-violet-700 text-white";
  const detail = isPurple ? "text-indigo-600 dark:text-indigo-400" : "text-violet-600 dark:text-violet-400";
  return { card, header, detail };
}

export default function Home() {
  const {
    valor,
    evento,
    loading,
    loteVigente,
    homeConfig,
    premios,
    inscricoesAbertas,
  } = useLoteVigente();

  const nomeEvento =
    typeof evento?.nome === "string" && evento.nome
      ? evento.nome
      : "Corrida Solidária";

  const dataApresentavel = evento?.data_evento
    ? new Date(String(evento.data_evento) + "T00:00:00").toLocaleDateString(
        "pt-BR",
      )
    : "Data a definir";

  const localApresentavel =
    (typeof evento?.local === "string" && evento.local.trim()) ||
    homeConfig.site?.localFallback?.trim() ||
    "Local a definir";

  const premiosExibir = premios.length > 0 ? premios : FALLBACK_PREMIOS;

  const logoAlt = homeConfig.logo?.alt;
  const logoUrl = homeConfig.logo?.imageUrl;

  return (
    <BackgroundWrapper intensity="medium" showAnimation={true}>
      <section className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-8 sm:py-12 md:py-16">
        <div className="text-center max-w-5xl px-4">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-xl opacity-25 animate-pulse"
                style={{
                  background: `linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))`,
                }}
              />
              <div className="relative bg-white/95 dark:bg-gray-800/95 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-sm border border-violet-200/60 dark:border-violet-700/50">
                <EventLogo
                  alt={logoAlt}
                  className="sm:w-80 sm:h-80"
                  height={240}
                  imageUrl={logoUrl}
                  variant="branca"
                  width={240}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="relative bg-gradient-to-br from-white/90 to-violet-50/70 dark:from-gray-800/90 dark:to-indigo-950/25 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-violet-200/50 dark:border-violet-800/40 shadow-2xl">
              <h1
                className={title({
                  size: "md",
                  class: "text-center mb-3 sm:mb-4",
                })}
              >
                <span
                  className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {nomeEvento.toUpperCase()}
                </span>
              </h1>
              <div className="flex justify-center items-center gap-2 sm:gap-4 my-4 sm:my-6">
                <Chip
                  className="text-sm sm:text-lg md:text-xl font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-white"
                  color="secondary"
                  size="lg"
                  style={{
                    background: `linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))`,
                  }}
                  variant="shadow"
                >
                  {homeConfig.hero.chipText}
                </Chip>
              </div>
              <h3
                className={title({
                  color: "violet",
                  size: "sm",
                  class:
                    "text-center font-semibold text-lg sm:text-xl md:text-2xl",
                })}
              >
                {homeConfig.hero.slogan}
              </h3>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 space-y-4">
            <div
              className={subtitle({
                class:
                  "text-center max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2 whitespace-pre-line",
              })}
            >
              {homeConfig.intro}
            </div>

            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-violet-100/90 to-indigo-100/90 dark:from-violet-950/35 dark:to-indigo-950/35 border-2 border-violet-300/50 dark:border-indigo-700/50 shadow-xl">
              <CardBody className="text-center p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl">📅</div>
                    <h4 className="font-bold text-base sm:text-lg text-violet-800 dark:text-violet-300">
                      Data
                    </h4>
                    <p className="text-lg sm:text-xl font-semibold">
                      {dataApresentavel}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl">🕕</div>
                    <h4 className="font-bold text-base sm:text-lg text-indigo-800 dark:text-indigo-300">
                      Horário
                    </h4>
                    <p className="text-lg sm:text-xl font-semibold">
                      {homeConfig.horario.principal}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {homeConfig.horario.concentracaoLabel}
                    </p>
                    {homeConfig.horario.concentracaoDetalhe ? (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {homeConfig.horario.concentracaoDetalhe}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl">📍</div>
                    <h4 className="font-bold text-base sm:text-lg text-violet-800 dark:text-violet-300">
                      Local
                    </h4>
                    <p className="text-lg sm:text-xl font-semibold whitespace-pre-line">
                      {localApresentavel}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className={title({
                size: "md",
                color: "violet",
                class: "mb-4 text-2xl sm:text-3xl md:text-4xl",
              })}
            >
              {homeConfig.modalidades.sectionTitle}
            </h2>
            <p
              className={subtitle({
                class:
                  "text-default-600 max-w-2xl mx-auto text-sm sm:text-base px-2",
              })}
            >
              {homeConfig.modalidades.sectionSubtitle}
            </p>
          </div>

          <div
            className={
              homeConfig.modalidades.items.length > 1
                ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
                : "grid grid-cols-1 gap-6 sm:gap-8 max-w-2xl mx-auto"
            }
          >
            {homeConfig.modalidades.items.map((m, idx) => {
              const shell = modalidadeShell(m);
              return (
                <Card key={`${m.titulo}-${idx}`} className={shell.card}>
                  <CardHeader className={shell.header}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl">{m.icon}</span>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                          {m.titulo}
                        </h3>
                        <p
                          className={
                            m.theme === "purple"
                              ? "text-indigo-100 text-sm sm:text-base"
                              : "text-violet-100 text-sm sm:text-base"
                          }
                        >
                          {m.subtitulo}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4 sm:p-6 md:p-8">
                    <div className="space-y-3 sm:space-y-4">
                      {m.detalhes.map((d) => (
                        <div key={d.label + d.value} className="flex items-center gap-2">
                          <span className={shell.detail}>{d.emoji}</span>
                          <span className="text-sm sm:text-base">
                            <strong>{d.label}</strong> {d.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-violet-50/90 to-indigo-50/90 dark:from-violet-950/25 dark:to-indigo-950/30 border-2 border-violet-200/80 dark:border-indigo-700/60 shadow-2xl">
            {inscricoesAbertas ? (
              <>
                <CardHeader
                  className="text-white text-center"
                  style={{
                    background: `linear-gradient(to right, var(--event-inscription-from), var(--event-inscription-to))`,
                  }}
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {homeConfig.inscricao.tituloAberto}
                    </h2>
                    <p className="text-white/90">
                      {homeConfig.inscricao.subtituloAberto}
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div
                          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 break-words leading-tight"
                          style={{ color: "var(--event-primary)" }}
                        >
                          {loading ? "Carregando..." : formatarMoeda(valor)}
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          {loteVigente?.nome || "Lote Atual"} - Kit completo
                          incluso na inscrição
                        </p>
                      </div>

                      <div className="space-y-3">
                        {homeConfig.inscricao.beneficios.map((b) => (
                          <div key={b} className="flex items-center gap-3">
                            <span
                              className="text-xl"
                              style={{ color: "var(--event-primary)" }}
                            >
                              ✅
                            </span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      {loteVigente?.requisitos_especiais ? (
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-start gap-3">
                            <span className="text-orange-500 text-xl">⚠️</span>
                            <div>
                              <p className="font-semibold text-orange-700 dark:text-orange-300 mb-1">
                                Requisito Especial:
                              </p>
                              <p className="text-sm text-orange-600 dark:text-orange-400">
                                {loteVigente.requisitos_especiais}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-6">
                      <div className="text-center">
                        <h3
                          className="text-xl font-bold mb-4"
                          style={{ color: "var(--event-primary)" }}
                        >
                          📊 Inscrições Realizadas
                        </h3>
                        <InscricaoStats />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button
                          as={Link}
                          className="font-semibold text-white w-full sm:flex-1"
                          href="/inscricao"
                          size="lg"
                          style={{
                            background: `linear-gradient(to right, var(--event-inscription-from), var(--event-inscription-to))`,
                          }}
                        >
                          Inscreva-se
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </>
            ) : (
              <>
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {homeConfig.inscricao.encerradoTitulo}
                    </h2>
                    <p className="text-blue-100">
                      {homeConfig.inscricao.encerradoSub}
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl mb-4">
                          {homeConfig.inscricao.encerradoEmoji}
                        </div>
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                          Evento Confirmado!
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 mb-4">
                          Não há inscrições abertas no momento.
                        </p>
                        {evento ? (
                          <p className="text-sm text-blue-500 dark:text-blue-400 leading-relaxed whitespace-pre-line">
                            Fique de olho na <strong>{nomeEvento}</strong>!
                            <br />
                            Aguardamos você no dia{" "}
                            <strong>{dataApresentavel}</strong> no local{" "}
                            <strong>{localApresentavel}</strong>.
                          </p>
                        ) : (
                          <p className="text-sm text-blue-500 dark:text-blue-400 leading-relaxed">
                            No momento não temos nenhuma corrida ativa
                            cadastrada. Volte em breve!
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                          📊 Inscrições Realizadas
                        </h3>
                        <InscricaoStats />
                      </div>

                      <div className="flex flex-col gap-4">
                        <Button
                          as={Link}
                          className="font-semibold"
                          color="primary"
                          href="/regulamento"
                          size="lg"
                        >
                          Ver Regulamento Completo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </>
            )}
          </Card>
        </div>
      </section>

      <Divider className="my-12" />

      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className={title({ size: "lg", color: "violet", class: "mb-4" })}>
            {homeConfig.kit.sectionTitle}
          </h2>
          <p
            className={subtitle({
              class: "text-default-600 max-w-2xl mx-auto",
            })}
          >
            {homeConfig.kit.sectionSubtitle}
          </p>
        </div>

        <KitSlider />
      </section>

      <Divider className="my-12" />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className={title({ size: "lg", color: "yellow", class: "mb-4" })}
            >
              {homeConfig.premiosSection.titulo}
            </h2>
            <p
              className={subtitle({
                class: "text-default-600 max-w-3xl mx-auto",
              })}
            >
              {homeConfig.premiosSection.subtitulo}
            </p>
          </div>

          <HomePremiosGrid premios={premiosExibir} />

          <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/25 dark:to-indigo-950/30 border border-violet-300/80 dark:border-indigo-700 max-w-4xl mx-auto">
            <CardBody className="p-6 text-center">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "var(--event-gradient-from)" }}
              >
                {homeConfig.brindes.titulo}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {homeConfig.brindes.texto}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      <Divider className="my-12" />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className={title({ size: "lg", color: "violet", class: "mb-4" })}
            >
              {homeConfig.causas.sectionTitle}
            </h2>
            <p
              className={subtitle({
                class: "text-default-600 max-w-3xl mx-auto",
              })}
            >
              {homeConfig.causas.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeConfig.causas.items.map((c, i) => (
              <Card
                key={`${c.titulo}-${i}`}
                className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/25 border border-violet-200 dark:border-indigo-800 hover:shadow-xl transition-shadow duration-300"
              >
                <CardBody className="p-8 text-center">
                  <div className="text-5xl mb-4">{c.icon}</div>
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: "var(--event-gradient-from)" }}
                  >
                    {c.titulo}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {c.texto}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700">
            <CardBody className="p-8 text-center">
              <h2
                className={title({ size: "lg", color: "blue", class: "mb-6" })}
              >
                {homeConfig.contato.sectionTitle}
              </h2>

              <p className={subtitle({ class: "mb-8 text-default-600" })}>
                {homeConfig.contato.redesSubtitle}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  isExternal
                  as={Link}
                  className="font-semibold"
                  color="success"
                  href={siteConfig.links.whatsapp}
                  size="lg"
                  startContent={<WhatsAppIcon />}
                  variant="shadow"
                >
                  WhatsApp
                </Button>

                <Button
                  isExternal
                  as={Link}
                  className="text-white font-semibold"
                  href={siteConfig.links.instagram}
                  size="lg"
                  startContent={<InstagramIcon />}
                  style={{
                    background: `linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))`,
                  }}
                  variant="shadow"
                >
                  Instagram
                </Button>
              </div>

              <div className="mt-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">
                  {homeConfig.contato.diretoTitulo}
                </h3>
                <p className="text-blue-700 dark:text-blue-300 whitespace-pre-line">
                  {homeConfig.contato.whatsappTexto}
                  <br />
                  <br />
                  <strong>Organização:</strong>{" "}
                  {homeConfig.contato.organizacaoTexto}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </BackgroundWrapper>
  );
}
