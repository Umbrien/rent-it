import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { Route } from "next";
import { useAuth } from "@/hooks/useAuth";
// import type { User } from "@prisma/client";
import {
  IconBuildingWarehouse,
  IconArrowDown,
  IconArrowUp,
  IconCurrencyHryvnia,
  IconUser,
  IconUserShield,
  IconWallet,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { NumberSpan } from "@/components/NumberSpan";

// const u: User = {
//   id: 1,
//   username: "user",
//   email: "user@gmail.com",
//   password: "user",
//   role: "USER",
//   balance: 1000,
// };
//
// const a: User = {
//   id: 2,
//   username: "admin",
//   email: "admin@example.com",
//   password: "admin",
//   role: "ADMIN",
//   balance: 1000,
// };

function HeaderLink({
  href,
  isActive,
  children,
  icon,
}: {
  href: Route;
  isActive: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  if (!icon)
    return (
      <Link href={href} className={`${isActive ? "italic" : ""}`}>
        {children}
      </Link>
    );

  return (
    <Link href={href} className={`${isActive ? "italic" : ""}`}>
      <span className="flex w-fit items-center gap-1">
        {icon}
        {children}
      </span>
    </Link>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    void (async () => {
      await router.push("/");
    })();
  };

  return (
    <div className="h-full w-full">
      <nav className="sticky top-0 z-50 flex h-[var(--height-navbar)] items-center justify-between border-b-4 border-primary-400 bg-white/60 p-4 text-gray-800 backdrop-blur">
        <div className="flex items-center space-x-8">
          <HeaderLink
            href="/"
            isActive={router.pathname == "/"}
            icon={
              <div className="rounded-lg bg-primary-200 p-2">
                <IconBuildingWarehouse size={24} />
              </div>
            }
          >
            <span className="ml-1 text-xl font-bold">rent-it</span>
          </HeaderLink>

          {user && (
            <>
              <HeaderLink
                href="/rent-your-warehouse"
                isActive={router.pathname == "/rent-your-warehouse"}
                icon={<IconArrowUp />}
              >
                Rent your warehouse
              </HeaderLink>
              <HeaderLink
                href="/warehouses-to-rent"
                isActive={router.pathname == "/warehouses-to-rent"}
                icon={<IconArrowDown />}
              >
                Warehouses to rent
              </HeaderLink>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <span className="flex w-fit gap-1">
              {user.role == "USER" ? <IconUser /> : <IconUserShield />}
              {user.username}
            </span>
            <span className="flex w-fit gap-1">
              <IconCurrencyHryvnia />
              <NumberSpan number={user.balance} />
            </span>
          </div>
        )}

        <div className="flex items-center space-x-8">
          <Link
            href={"/admin"}
            className={`${
              user?.role !== "ADMIN" && "invisible"
            } rounded-md bg-primary-100 p-2 text-gray-600 shadow-lg shadow-primary-200`}
          >
            Admin dashboard
          </Link>
          {user ? (
            <>
              <HeaderLink
                href="/top-up"
                isActive={router.pathname == "/top-up"}
                icon={<IconWallet />}
              >
                Top up balance
              </HeaderLink>
              <button onClick={handleLogout}>
                <span className={`flex w-fit gap-1`}>
                  <IconLogout />
                  Logout
                </span>
              </button>
            </>
          ) : (
            <HeaderLink
              href="/login"
              isActive={router.pathname == "/login"}
              icon={<IconLogin />}
            >
              Login
            </HeaderLink>
          )}
        </div>
      </nav>

      {children}
    </div>
  );
}
