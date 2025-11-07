import { Menu, Github } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import DMLogo from "@/assets/images/DM-logo.png";

interface HeaderProps {
  githubLink: string;
}

const Header = ({ githubLink: githubLink }: HeaderProps) => {
  return (
    <section className="py-2">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={DMLogo} className="max-h-8 dark:invert" alt="logo" />
            </div>
            <div className="flex items-center"></div>
          </div>
          <div className="flex gap-2 ">
            <a href={githubLink}>
              <Button variant="outline" size="icon">
                <Github className="size-4" />
              </Button>
            </a>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={DMLogo} className="max-h-12 dark:invert" alt="Logo" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <img
                        src={DMLogo}
                        className="max-h-8 dark:invert"
                        alt="Logo"
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex flex-col gap-3">
                    <a href={githubLink}>
                      <Button variant="outline" size="icon">
                        <Github className="size-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Header };
