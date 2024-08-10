import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/theme/toggler";
import { siteConfig } from "@/config/site.config";
import {
  CodeIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export default function Socials() {
  return (
    <>
      <ThemeToggler />
      <Button
        variant="outline"
        size="sm"
        className="rounded size-8 p-0"
        asChild
      >
        <a href={siteConfig.links.x} target="_blank" rel="noreferrer">
          <TwitterLogoIcon />
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded size-8 p-0"
        asChild
      >
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <GitHubLogoIcon />
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded size-8 p-0"
        asChild
      >
        <a
          href={`${siteConfig.links.github}/tree/main/src/components/chart-component.tsx`}
          target="_blank"
          rel="noreferrer"
        >
          <CodeIcon />
        </a>
      </Button>
    </>
  );
}
