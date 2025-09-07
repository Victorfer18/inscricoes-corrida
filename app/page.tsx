import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { RunnerIcon, WhatsAppIcon, InstagramIcon, FacebookIcon } from "@/components/icons";
import { EventLogo } from "../components/event-logo";
import { KitSlider } from "@/components/kit-slider";
import { BackgroundWrapper } from "@/components/background-wrapper";

export default function Home() {
  return (
    <BackgroundWrapper intensity="medium" showAnimation={true}>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-8 sm:py-12 md:py-16">
        <div className="text-center max-w-5xl px-4">
          {/* Imagem Oficial do Evento */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl sm:rounded-3xl blur-xl opacity-25 animate-pulse"></div>
              <div className="relative bg-white/95 dark:bg-gray-800/95 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-sm border border-pink-200/50 dark:border-pink-700/50">
                <EventLogo width={240} height={240} variant="branca" className="sm:w-80 sm:h-80" />
              </div>
            </div>
          </div>

          {/* Título Principal */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative bg-gradient-to-br from-white/90 to-pink-50/80 dark:from-gray-800/90 dark:to-pink-900/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-pink-200/50 dark:border-pink-700/50 shadow-2xl">
              <h1 className={title({ size: "md", class: "text-center mb-3 sm:mb-4" })}>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  1ª CORRIDA SOLIDÁRIA
                </span>
              </h1>
              <h2 className={title({ size: "md", class: "text-center mb-3 sm:mb-4" })}>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  OUTUBRO ROSA
        </span>
              </h2>
              <div className="flex justify-center items-center gap-2 sm:gap-4 my-4 sm:my-6">
                <Chip 
                  color="secondary" 
                  variant="shadow" 
                  size="lg"
                  className="text-sm sm:text-lg md:text-xl font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  🏃‍♀️ PROJETO JAÍBA 🏃‍♂️
                </Chip>
              </div>
              <h3 className={title({ color: "pink", size: "sm", class: "text-center font-semibold text-lg sm:text-xl md:text-2xl" })}>
                "Eles e Elas Correndo Pela Vida"
              </h3>
              </div>
            </div>

          {/* Informações do Evento */}
          <div className="mt-6 sm:mt-8 space-y-4">
            <div className={subtitle({ class: "text-center max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2" })}>
              🎗️ Participe desta importante causa! Uma corrida que une <strong>esporte</strong>, <strong>conscientização</strong> e <strong>solidariedade</strong> em apoio à prevenção do câncer de mama e arrecadação de alimentos para famílias necessitadas.
            </div>
            
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-pink-100/90 to-purple-100/90 dark:from-pink-900/30 dark:to-purple-900/30 border-2 border-pink-300/50 dark:border-pink-700/50 shadow-xl">
              <CardBody className="text-center p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl">📅</div>
                    <h4 className="font-bold text-base sm:text-lg text-pink-700 dark:text-pink-300">Data</h4>
                    <p className="text-lg sm:text-xl font-semibold">26 de Outubro</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">2025</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl">🕕</div>
                    <h4 className="font-bold text-base sm:text-lg text-purple-700 dark:text-purple-300">Horário</h4>
                    <p className="text-lg sm:text-xl font-semibold">06h00</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Concentração</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl">📍</div>
                    <h4 className="font-bold text-base sm:text-lg text-pink-700 dark:text-pink-300">Local</h4>
                    <p className="text-lg sm:text-xl font-semibold">Trevo do Eltinho</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projeto Jaíba/NS2</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={title({ size: "md", color: "pink", class: "mb-4 text-2xl sm:text-3xl md:text-4xl" })}>
              🏃‍♀️ Modalidades do Evento
            </h2>
            <p className={subtitle({ class: "text-default-600 max-w-2xl mx-auto text-sm sm:text-base px-2" })}>
              Escolha sua modalidade e participe desta causa importante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-2 border-pink-300 dark:border-pink-700 hover:scale-105 transition-transform duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">🏃‍♀️</span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Corrida 5km</h3>
                    <p className="text-pink-100 text-sm sm:text-base">Para os aventureiros</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600">⏰</span>
                    <span className="text-sm sm:text-base"><strong>Largada:</strong> 07h30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600">📏</span>
                    <span className="text-sm sm:text-base"><strong>Distância:</strong> 5 quilômetros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600">🎯</span>
                    <span className="text-sm sm:text-base"><strong>Público:</strong> Atletas e entusiastas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600">⏱️</span>
                    <span className="text-sm sm:text-base"><strong>Duração:</strong> Aproximadamente 1h</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-300 dark:border-purple-700 hover:scale-105 transition-transform duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">🚶‍♀️</span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Caminhada 2,5km</h3>
                    <p className="text-purple-100 text-sm sm:text-base">Para toda a família</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">⏰</span>
                    <span className="text-sm sm:text-base"><strong>Largada:</strong> 07h00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">📏</span>
                    <span className="text-sm sm:text-base"><strong>Distância:</strong> 2,5 quilômetros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">🎯</span>
                    <span className="text-sm sm:text-base"><strong>Público:</strong> Todas as idades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">⏱️</span>
                    <span className="text-sm sm:text-base"><strong>Duração:</strong> Aproximadamente 1h</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Inscrições e Valor */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">💳 Inscrições Abertas!</h2>
                <p className="text-green-100">Garante já sua vaga nesta causa importante</p>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-600 mb-2">R$ 25</div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Valor único para ambas modalidades</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Kit completo incluso</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Medalha de participação</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Camiseta oficial do evento</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Hidratação durante o percurso</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Apoio médico e segurança</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300">
                      📊 Progresso das Inscrições
                    </h3>
                    <Progress 
                      value={65} 
                      color="success" 
                      size="lg"
                      className="mb-2"
                      showValueLabel={true}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      130 de 200 vagas preenchidas
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button
                      as={Link}
                      href="/inscricao"
                      color="success"
                      size="lg"
                      className="font-bold text-white"
                      startContent={<RunnerIcon />}
                    >
                      Fazer Inscrição Agora
                    </Button>
                    
                    <Button
                      as={Link}
                      href="/regulamento"
                      variant="bordered"
                      color="success"
                      size="lg"
                      className="font-semibold"
                    >
                      Ver Regulamento Completo
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Seção do Kit */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className={title({ size: "lg", color: "pink", class: "mb-4" })}>
            🎁 Kit de Participação
          </h2>
          <p className={subtitle({ class: "text-default-600 max-w-2xl mx-auto" })}>
            Todos os participantes receberão um kit completo com itens exclusivos do evento
          </p>
        </div>
        
        <KitSlider />
      </section>

      <Divider className="my-12" />

      {/* Seção "Uma Causa que Importa" */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={title({ size: "lg", color: "violet", class: "mb-4" })}>
              💖 Uma Causa que Importa
            </h2>
            <p className={subtitle({ class: "text-default-600 max-w-3xl mx-auto" })}>
              Mais que uma corrida, um movimento de conscientização e solidariedade
            </p>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800 hover:shadow-xl transition-shadow duration-300">
              <CardBody className="p-8 text-center">
                <div className="text-5xl mb-4">🎗️</div>
                <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                  Outubro Rosa
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Campanha mundial de conscientização sobre a importância da prevenção e do diagnóstico precoce do câncer de mama. Juntos pela vida!
                </p>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-shadow duration-300">
              <CardBody className="p-8 text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                  Solidariedade
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Arrecadação de alimentos não perecíveis para famílias em situação de vulnerabilidade social. Esporte que transforma vidas!
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow duration-300">
              <CardBody className="p-8 text-center">
                <div className="text-5xl mb-4">🏃‍♀️</div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                  Saúde & Bem-estar
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Promovendo a prática de atividades físicas e a integração da comunidade. Movimento que gera saúde e união!
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Contato e Redes Sociais */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700">
            <CardBody className="p-8 text-center">
              <h2 className={title({ size: "lg", color: "blue", class: "mb-6" })}>
                Fique Conectado
              </h2>
              
              <p className={subtitle({ class: "mb-8 text-default-600" })}>
                Siga nossas redes sociais e fique por dentro de todas as novidades do evento
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  as={Link}
                  href={siteConfig.links.whatsapp}
                  isExternal
                  color="success"
                  variant="shadow"
                  size="lg"
                  startContent={<WhatsAppIcon />}
                  className="font-semibold"
                >
                  WhatsApp
                </Button>
                
                <Button
                  as={Link}
                  href={siteConfig.links.instagram}
          isExternal
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
                  variant="shadow"
                  size="lg"
                  startContent={<InstagramIcon />}
                >
                  Instagram
                </Button>
                
                <Button
                  as={Link}
                  href={siteConfig.links.facebook}
          isExternal
                  color="primary"
                  variant="shadow"
                  size="lg"
                  startContent={<FacebookIcon />}
                  className="font-semibold"
                >
                  Facebook
                </Button>
      </div>

              <div className="mt-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">
                  📞 Contato Direto
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>WhatsApp:</strong> (31) 99820-9915 - Gil<br />
                  <strong>Organização:</strong> Projeto Jaíba - NS2<br />
                  <strong>E-mail:</strong> contato@projetojaiba.com.br
                </p>
              </div>
            </CardBody>
          </Card>
      </div>
    </section>
    </BackgroundWrapper>
  );
}