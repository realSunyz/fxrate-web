import Link from "next/link";
import { DarkThemeToggle } from "flowbite-react";
import { Navbar, NavbarBrand } from "flowbite-react";

export default function Component() {
  return (
    <Navbar className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b text-sm py-2 border-gray-200 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      <div className="container mx-auto flex items-center justify-between px-4">
        <NavbarBrand as={Link} href="#">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            fxRate Web Next Generation
          </span>
        </NavbarBrand>
        <DarkThemeToggle />
      </div>
    </Navbar>
  );
}
