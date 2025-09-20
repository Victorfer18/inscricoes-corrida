import nodemailer from "nodemailer";

import { InscricaoData } from "@/types/database";
import { formatarCPF, formatarCelular, formatarMoeda } from "@/lib/utils";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig;

  constructor() {
    this.config = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER || "",
        pass: process.env.GMAIL_APP_PASSWORD || "", // App Password, não a senha normal
      },
    };

    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport(this.config);
    } catch (error) {
    }
  }

  private async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendEmail({
    to,
    subject,
    html,
    text,
  }: SendEmailParams): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    const isConnected = await this.verifyConnection();

    if (!isConnected) {
      return false;
    }

    try {
      const mailOptions = {
        from: {
          name: "Corrida Solidária Outubro Rosa",
          address: this.config.auth.user,
        },
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async sendConfirmationEmail(inscricaoData: InscricaoData, valor?: number): Promise<boolean> {
    if (!inscricaoData.email) {
      return false;
    }

    const subject =
      "✅ Confirmação de Inscrição - Corrida Solidária Outubro Rosa";
    const html = this.generateConfirmationEmailTemplate(inscricaoData, valor);

    return await this.sendEmail({
      to: inscricaoData.email,
      subject,
      html,
    });
  }

  private generateConfirmationEmailTemplate(inscricao: InscricaoData, valor?: number): string {
    const dataEvento = "26 de Outubro de 2025";
    const horaEvento = "06h00 (Concentração)";
    const localEvento = "Trevo do Eltinho - Projeto Jaíba/NS2";

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Inscrição - Corrida Solidária</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #e91e63, #9c27b0);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px 20px;
        }
        
        .success-badge {
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 25px;
        }
        
        .success-badge h2 {
            font-size: 20px;
            margin-bottom: 5px;
        }
        
        .participant-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        
        .participant-info h3 {
            color: #e91e63;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: bold;
            color: #666;
        }
        
        .info-value {
            color: #333;
        }
        
        .event-details {
            background: linear-gradient(135deg, #fff3e0, #ffecb3);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #ff9800;
        }
        
        .event-details h3 {
            color: #f57c00;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .kit-info {
            background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #4caf50;
        }
        
        .kit-info h3 {
            color: #2e7d32;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .kit-locations {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .kit-location {
            background-color: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #ddd;
        }
        
        .kit-location h4 {
            color: #2e7d32;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .important-note {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            margin-bottom: 25px;
        }
        
        .important-note strong {
            color: #856404;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        
        .footer p {
            margin-bottom: 10px;
            color: #666;
        }
        
        .social-links {
            margin-top: 15px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            padding: 8px 16px;
            background-color: #e91e63;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 5px;
            }
            
            .kit-locations {
                grid-template-columns: 1fr;
            }
            
            .info-row {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏃‍♀️ 1ª Corrida Solidária Outubro Rosa 🏃‍♂️</h1>
            <p>Projeto Jaíba - "Eles e Elas Correndo Pela Vida"</p>
        </div>
        
        <div class="content">
            <div class="success-badge">
                <h2>🎉 Inscrição confirmada!</h2>
                <p>Parabéns! Sua inscrição foi realizada com sucesso</p>
            </div>
            
            <div class="participant-info">
                <h3>📋 Dados do Participante</h3>
                <div class="info-row">
                    <span class="info-label">Nome:</span>
                    <span class="info-value">${inscricao.nome_completo}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">CPF:</span>
                    <span class="info-value">${formatarCPF(inscricao.cpf)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Idade:</span>
                    <span class="info-value">${inscricao.idade} anos</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Sexo:</span>
                    <span class="info-value">${inscricao.sexo}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Celular:</span>
                    <span class="info-value">${formatarCelular(inscricao.celular)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tamanho da Camiseta:</span>
                    <span class="info-value">${inscricao.tamanho_blusa}</span>
                </div>
            </div>
            
            <div class="event-details">
                <h3>📅 Detalhes do Evento</h3>
                <div class="info-row">
                    <span class="info-label">📅 Data:</span>
                    <span class="info-value">${dataEvento}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🕕 Horário:</span>
                    <span class="info-value">${horaEvento}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📍 Local:</span>
                    <span class="info-value">${localEvento}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">💰 Valor Pago:</span>
                    <span class="info-value">${formatarMoeda(valor || 79.9)}</span>
                </div>
            </div>
            
            <div class="kit-info">
                <h3>📦 Retirada do Kit</h3>
                <p>Seu kit de participação estará disponível para retirada:</p>
                
                <div class="kit-locations">
                    <div class="kit-location">
                        <h4>🏠 NS2 - Atletas da Região</h4>
                        <p><strong>Data:</strong> 20/10/2025</p>
                        <p><strong>Local:</strong> NS2</p>
                    </div>
                    <div class="kit-location">
                        <h4>🌍 Outras Regiões</h4>
                        <p><strong>Data:</strong> Dia da corrida</p>
                        <p><strong>Horário:</strong> 06:00 às 07:00</p>
                        <p><strong>Local:</strong> Ponto de apoio</p>
                    </div>
                </div>
            </div>
            
            <div class="important-note">
                <p><strong>⚠️ Importante:</strong> Leve um documento com foto para retirar o kit de participação.</p>
            </div>
            
            <div class="kit-info">
                <h3>🎁 Seu Kit Inclui</h3>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>✅ Camiseta oficial do evento</li>
                    <li>✅ Medalha de participação</li>
                    <li>✅ Garrafa d'água</li>
                    <li>✅ Barra energética</li>
                    <li>✅ Bolsa esportiva</li>
                    <li>✅ Hidratação durante o percurso</li>
                    <li>✅ Apoio médico e segurança</li>
                </ul>
            </div>
            
            <div class="important-note">
                <p><strong>🎁 Bônus:</strong> Participantes do 1º lote concorrem a uma cesta básica!</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Dúvidas?</strong></p>
            <p>WhatsApp: (31) 99820-9915 - Gil</p>
            <p>E-mail: contato@projetojaiba.com.br</p>
            
            <div class="social-links">
                <a href="https://wa.me/5531998209915">WhatsApp</a>
                <a href="#">Instagram</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Este é um email automático, não responda a esta mensagem.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }
}

// Instância singleton do serviço de email
export const emailService = new EmailService();
