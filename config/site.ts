export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "1ª Corrida e Caminhada - Outubro Rosa",
  description: "Projeto Jaíba - Corrida e Caminhada Outubro Rosa. 2,5km caminhada e 5km de corrida.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Inscrição",
      href: "/inscricao",
    },
    {
      label: "Regulamento",
      href: "/regulamento",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Inscrição",
      href: "/inscricao",
    },
    {
      label: "Regulamento",
      href: "/regulamento",
    },
    {
      label: "Sobre",
      href: "/about",
    },
  ],
  links: {
    whatsapp: "https://wa.me/5531998209915",
    instagram: "https://instagram.com/projetojaiba",
    facebook: "https://facebook.com/projetojaiba",
    docs: "https://heroui.com",
    sponsor: "https://wa.me/5531998209915?text=Gostaria%20de%20apoiar%20o%20Projeto%20Jaíba",
  },
};