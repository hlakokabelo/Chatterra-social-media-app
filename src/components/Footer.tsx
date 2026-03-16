
import { appName } from "../utils/appName";

export interface IFooterProps {}

export function Footer() {
  return (
    <div>
      <footer className=" items-center relative z-10 mt-auto py-6 text-center text-sm text-gray-500 border-t border-gray-800/50">
        <div className=" container px-4">
          <p>
            © {new Date().getFullYear()} {appName}. All rights reserved.{" "}
          </p>
        </div>
      </footer>
    </div>
  );
}
