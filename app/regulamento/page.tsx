"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";

import { BackgroundWrapper } from "@/components/background-wrapper";
import { eventConfig } from "@/config/event";
import { title, subtitle } from "@/components/primitives";
import { DocumentIcon } from "@/components/icons";
import { formatarMoeda } from "@/lib/utils";
import { useLoteVigente } from "@/hooks/useLoteVigente";
import { useInscricoesStats } from "@/hooks/useInscricoesStats";

export default function RegulamentoPage() {
  const { valor, loading, loteVigente } = useLoteVigente();
  const { total: totalInscricoes, loading: loadingStats } =
    useInscricoesStats();

  return (
    <BackgroundWrapper intensity="strong" showAnimation={false}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-full shadow-lg">
              <DocumentIcon className="text-white" size={64} />
            </div>
          </div>

          <h1 className={title({ size: "lg", class: "mb-4" })}>
            <span className={title({ color: "pink", size: "lg" })}>
              Regulamento
            </span>{" "}
            da Corrida
          </h1>

          <div className={subtitle({ class: "max-w-2xl mx-auto" })}>
            Leia atentamente todas as regras e disposições para participar da 1ª
            Corrida e Caminhada Outubro Rosa
          </div>
        </div>

        {/* Organização */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">1. Da Organização</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Evento:</h3>
              <p>
                Corrida Solidária Outubro Rosa - &ldquo;Eles e Elas Correndo
                Pela Vida&rdquo;
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Organização:</h3>
              <p>
                Promovida pelo Projeto Fitness - NS2, com caráter comunitário,
                esportivo e de integração social, sem fins lucrativos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Coordenação:</h3>
              <p>
                O evento será coordenado por uma Comissão Organizadora,
                responsável por todas as decisões relacionadas à prova.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Data, Local e Percurso */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">2. Data, Local e Percurso</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Data e Horário:</h3>
              <p>
                <strong>{eventConfig.dataEvento}</strong>
              </p>
              <p>
                Concentração a partir das{" "}
                <strong>{eventConfig.horarioConcentracao}</strong> no{" "}
                {eventConfig.local}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Modalidades e Largadas:
              </h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Chip color="secondary" variant="flat">
                    🚶‍♀️ Caminhada 2,5km - {eventConfig.horarioCaminhada}
                  </Chip>
                  <Chip color="secondary" variant="flat">
                    🏃‍♀️ Corrida 5km - {eventConfig.horarioCorrida}
                  </Chip>
                </div>
                <p className="text-sm text-default-600">
                  Duração aproximada de 1h cada modalidade
                </p>
                <p className="text-sm text-default-600">
                  Previsão de encerramento: 12h00
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Percurso:</h3>
              <p>
                O percurso da <strong>Caminhada 2,5km</strong> terá início na estrada ao lado da Quadra Poliesportiva do NS2, no Projeto Jaíba. Os participantes seguirão em direção à área rural, entrando na primeira rua à direita (Rua A) em direção à comunidade NS2. O trajeto continua com uma curva à esquerda, passando por uma ponte pequena que conecta à área rural. Em seguida, será feita uma nova curva à direita para retornar à comunidade NS2, onde os inscritos completarão duas voltas pelas ruas internas da comunidade. O percurso termina na linha de chegada localizada na quadra poliesportiva.
              </p>
              <p className="text-sm text-default-600 mt-2">
                Todo o trajeto será devidamente sinalizado com cones e contará com orientadores e equipe de apoio para garantir a segurança dos participantes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Hidratação:</h3>
              <p>
                Haverá pontos de hidratação ao longo do percurso e na chegada.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Objetivo do Evento */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">3. Objetivo do Evento</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                O evento tem como finalidade:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Incentivar a prática de atividades físicas e a integração
                  entre os participantes e a comunidade
                </li>
                <li>
                  Promover a conscientização sobre a importância da atividade
                  física associada à prevenção de doenças
                </li>
                <li>
                  Arrecadar alimentos não perecíveis para doação a famílias em
                  situação de vulnerabilidade social
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Participação */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">4. Participação</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Quem pode participar:</h3>
              <p>Poderão participar da corrida pessoas de todas as idades.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Menores de idade:</h3>
              <p>
                Menores de 18 anos somente poderão participar com autorização
                por escrito e acompanhamento de responsável legal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Responsabilidades:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Cada participante é responsável por avaliar suas condições de
                  saúde e aptidão física antes da corrida
                </li>
                <li>
                  O participante deve respeitar as orientações dos
                  organizadores, voluntários e equipe de apoio durante todo o
                  evento
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Inscrições */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">5. Inscrições</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Prazo:</h3>
              <p>
                As inscrições poderão ser feitas até o dia{" "}
                <strong>30/09/2025</strong> junto à organização ou pelo
                formulário disponibilizado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Valor da Inscrição:</h3>
              <p>
                {loading ? "Carregando..." : formatarMoeda(valor)} para ambas as
                modalidades
              </p>
              {loteVigente && (
                <p className="text-sm text-default-600 mt-1">
                  <strong>{loteVigente.nome}</strong> -{" "}
                  {loteVigente.total_vagas} vagas disponíveis
                </p>
              )}
              {loteVigente?.requisitos_especiais && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 font-medium">
                  ⚠️ <strong>Requisito especial:</strong>{" "}
                  {loteVigente.requisitos_especiais}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Forma de Pagamento:</h3>
              <p>Exclusivamente via PIX</p>
              <p className="text-sm text-default-600 mt-1">
                Chave PIX: aa014320-6298-49d2-bbab-3836f99d9b93
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Confirmação:</h3>
              <p>
                A inscrição só será efetivada após a confirmação do pagamento.
                Deverá ser encaminhado o comprovante de pagamento no
                preenchimento do formulário.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limite de Vagas:</h3>
              <p>
                O número de vagas será limitado a{" "}
                <strong>{loteVigente?.total_vagas || 200} participantes</strong>{" "}
                no {loteVigente?.nome || "lote atual"}, respeitando a ordem de
                inscrição.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Segurança */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">6. Segurança</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Equipamentos:</h3>
              <p>
                O uso de roupas e calçados adequados à prática esportiva é de
                responsabilidade do participante.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Apoio:</h3>
              <p>
                A organização contará com apoio de voluntários ao longo do
                percurso para orientação.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Primeiros Socorros:</h3>
              <p>
                Haverá suporte básico de primeiros socorros disponível, porém a
                organização não se responsabiliza por acidentes ou problemas de
                saúde decorrentes da participação.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recomendação:</h3>
              <p>
                Recomenda-se que cada corredor realize avaliação médica prévia.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Classificação e Premiação */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">7. Classificação e Premiação</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Caráter do Evento:</h3>
              <p>
                A Corrida Solidária tem caráter competitivo com premiação para
                os primeiros colocados.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Premiação:</h3>
              <div className="space-y-2">
                <p>
                  <strong>Classificação e Premiação:</strong> Será premiados do
                  1º ao 5º lugar geral, ao cruzar a faixa de chegada.
                </p>
                <div className="ml-4 space-y-1">
                  <p>
                    🥇 <strong>1º lugar:</strong> R$ 500,00 + Troféu 🏆
                  </p>
                  <p>
                    🥈 <strong>2º lugar:</strong> R$ 400,00 + Troféu 🏆
                  </p>
                  <p>
                    🥉 <strong>3º lugar:</strong> R$ 300,00 + Troféu 🏆
                  </p>
                  <p>
                    🏅 <strong>4º lugar:</strong> R$ 200,00 + Troféu 🏆
                  </p>
                  <p>
                    🏅 <strong>5º lugar:</strong> R$ 150,00 + Troféu 🏆
                  </p>
                </div>
                <p>
                  <strong>Brindes e Sorteios:</strong> Haverá diversos brindes e
                  sorteios especiais durante o evento.
                </p>
                <p>
                  <strong>Medalha de Participação:</strong> Todos os
                  participantes que concluírem o percurso receberão medalha
                  simbólica de participação.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Direitos de Imagem */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">8. Direitos de Imagem</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <p>
                O participante autoriza, de forma gratuita, o uso de sua imagem
                em fotos e vídeos do evento, para fins de divulgação em redes
                sociais, sites e materiais da organização.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Disposições Gerais */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold">9. Disposições Gerais</h2>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Realização do Evento:</h3>
              <p>
                A Corrida Solidária será realizada mesmo em caso de chuva leve.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Cancelamento:</h3>
              <p>
                A organização se reserva o direito de adiar ou cancelar o evento
                em situações que comprometam a segurança dos participantes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Casos Omissos:</h3>
              <p>
                Casos omissos neste regulamento serão resolvidos pela Comissão
                Organizadora.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dúvidas:</h3>
              <p>
                Para esclarecimentos, entre em contato via WhatsApp:
                <strong> (31) 99820-9915 - Gil</strong>
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg p-4 mt-6">
              <p className="text-center font-semibold">
                <strong>IMPORTANTE:</strong> Ao se inscrever, o participante
                declara estar ciente e de acordo com todas as disposições deste
                regulamento.
              </p>
            </div>
          </CardBody>
        </Card>

        <Divider className="my-8" />

        <div className="text-center">
          <p className="text-sm text-default-600">
            Projeto Jaíba - 1ª Corrida e Caminhada Outubro Rosa
          </p>
          <p className="text-sm text-default-600">
            Região do Jaíba - Minas Gerais
          </p>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
