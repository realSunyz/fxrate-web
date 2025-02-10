import Link from "next/link";
import { DarkThemeToggle } from "flowbite-react";
import { Navbar, NavbarBrand } from "flowbite-react";

export default function Component() {
  return (
    <Navbar className="flex w-full justify-center">
      <div className="container mx-auto flex items-center justify-between px-4">
        <NavbarBrand as={Link} href="#">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            fxRate
          </span>
        </NavbarBrand>
        <DarkThemeToggle />
      </div>
    </Navbar>
  );
}
