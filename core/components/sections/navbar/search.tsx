"use client";

import { useState, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  users: User[];
};

const Search = ({ users }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div onClick={handleSetFocus} className="relative w-full px-2">
      <div className="flex items-center space-x-2 rounded-lg border p-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search here..."
          className="w-full bg-transparent text-sm focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchTerm.length > 0 && (
        <Transition
          show={searchTerm.length > 0}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Listbox
            as="ul"
            className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-md bg-white shadow-lg">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Link key={user.id} href={`/${user.username}/profile`}>
                  <Listbox.Option
                    value={user}
                    className={({ active }) =>
                      `${active ? "bg-blue-500 text-white" : "text-gray-900"}
                        cursor-default select-none py-2 pl-3 pr-9`
                    }>
                    {user.name}
                  </Listbox.Option>
                </Link>
              ))
            ) : (
              <Listbox.Option
                value=""
                disabled
                className="cursor-default select-none py-2 pl-3 pr-9">
                No results found.
              </Listbox.Option>
            )}
          </Listbox>
        </Transition>
      )}
    </div>
  );
};

export default Search;
