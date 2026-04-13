"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { UserCircleIcon } from "@heroicons/react/24/outline";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import { EventLogo } from "@/components/event-logo";
import { useLoteVigente } from "@/hooks/useLoteVigente";

export const Navbar = () => {
  const { evento, homeConfig, loading, inscricoesAbertas } = useLoteVigente();

  const brandLine =
    typeof evento?.nome === "string" && evento.nome.trim().length > 0
      ? evento.nome.trim()
      : homeConfig.site?.brandSubtitle?.trim() ||
        "Corrida solidária";

  const showInscricao =
    inscricoesAbertas && homeConfig.site?.showNavInscricao !== false;

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit min-w-0">
          <NextLink
            className="flex justify-start items-center gap-2 min-w-0"
            href="/"
          >
            <div className="flex-shrink-0">
              <EventLogo
                alt={homeConfig.logo?.alt}
                height={40}
                imageUrl={homeConfig.logo?.imageUrl}
                variant="branca"
                width={40}
              />
            </div>
            <p
              className="font-bold text-sm sm:text-base truncate max-w-[12rem] sm:max-w-md lg:max-w-xl"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
              title={brandLine}
            >
              {brandLine.toUpperCase()}
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2 items-center">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                  item.label === "Admin" &&
                    "flex items-center gap-1 text-xs opacity-70 hover:opacity-100",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label === "Admin" && (
                  <UserCircleIcon className="w-4 h-4" />
                )}
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
          {showInscricao ? (
            <NavbarItem>
              <Button
                as={NextLink}
                className="font-semibold text-white"
                href="/inscricao"
                size="sm"
                style={{
                  background: `linear-gradient(to right, var(--event-inscription-from), var(--event-inscription-to))`,
                }}
              >
                Inscreva-se
              </Button>
            </NavbarItem>
          ) : null}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2 items-center">
          <Link
            isExternal
            aria-label="WhatsApp"
            href={siteConfig.links.whatsapp}
          >
            <WhatsAppIcon className="text-green-500 hover:text-green-600" />
          </Link>
          <Link
            isExternal
            aria-label="Instagram"
            href={siteConfig.links.instagram}
          >
            <InstagramIcon className="text-pink-500 hover:text-pink-600" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="WhatsApp" href={siteConfig.links.whatsapp}>
          <WhatsAppIcon className="text-green-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {showInscricao ? (
            <NavbarMenuItem>
              <Button
                as={NextLink}
                className="w-full font-semibold text-white mb-2"
                href="/inscricao"
                size="lg"
                style={{
                  background: `linear-gradient(to right, var(--event-inscription-from), var(--event-inscription-to))`,
                }}
              >
                Inscreva-se
              </Button>
            </NavbarMenuItem>
          ) : null}
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium w-full",
                  item.label === "Admin" &&
                    "flex items-center gap-2 text-sm opacity-70",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label === "Admin" && (
                  <UserCircleIcon className="w-4 h-4" />
                )}
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}

          <div className="flex gap-4 mt-4 justify-center">
            <Link
              isExternal
              aria-label="WhatsApp"
              href={siteConfig.links.whatsapp}
            >
              <WhatsAppIcon className="text-green-500" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="Instagram"
              href={siteConfig.links.instagram}
            >
              <InstagramIcon className="text-pink-500" size={24} />
            </Link>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
