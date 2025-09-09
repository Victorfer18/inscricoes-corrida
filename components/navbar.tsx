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
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/icons";
import { EventLogo } from "@/components/event-logo";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit min-w-0">
          <NextLink
            className="flex justify-start items-center gap-2 min-w-0"
            href="/"
          >
            <div className="flex-shrink-0">
              <EventLogo height={40} variant="branca" width={40} />
            </div>
            <p className="font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-sm sm:text-base truncate">
              CORRIDA SOLIDÁRIA
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
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
          <Link
            isExternal
            aria-label="Facebook"
            href={siteConfig.links.facebook}
          >
            <FacebookIcon className="text-blue-500 hover:text-blue-600" />
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
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium w-full",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}

          {/* Links sociais no menu mobile */}
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
            <Link
              isExternal
              aria-label="Facebook"
              href={siteConfig.links.facebook}
            >
              <FacebookIcon className="text-blue-500" size={24} />
            </Link>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
