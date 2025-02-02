import React, { FunctionComponent, useEffect, useState } from 'react';

import { ShoppingCartIcon, StarIcon, StoreLogoIcon, TagIcon, UserIcon } from './Icons';

interface Product {
  Name: string
  Price: number
  InStock: boolean
  Rating: number
  ImageUrl: string
}

interface User {
  BirthDate: Date
  Name: string
  ProfilePictureUrl: string
  Salary: number
}

interface Campaign {
  title: string
  pictureUrl: string
  gotoUrl: string
}

export const App: FunctionComponent = () => {
  const [apiProductList, setApiProductList] = useState<Product[]>([]);
  const [pageProductList, setPageProductList] = useState<Product[]>([]);
  const [userDialogMode, setUserDialogMode] = useState<boolean>(false);
  const [cartDialogMode, setCartDialogMode] = useState<boolean>(false);
  const [shoppingCartList, setShoppingCartList] = useState<Product[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const getProductList = async () => {
      const response = await fetch("/api/product/get-list");
      const data = await response.json();
      setApiProductList(data);
      setPageProductList(data.slice(0, 5));
    };

    const getCurrentCampaign = async () => {
      const response = await fetch("/api/campaign/get-current");
      const data = await response.json();
      setCurrentCampaign(data);
    };

    getProductList();
    getCurrentCampaign();
  }, []);

  return (
    <div className="flex flex-col bg-gray-200 h-min-3/4 px-4 select-none rounded-xl">
      <a href={currentCampaign?.gotoUrl} target="_blank" className="-mx-4"><img src={currentCampaign?.pictureUrl} alt={currentCampaign?.title} className="rounded-t-xl" /></a>
      {userDialogMode &&
        <div className="absolute inset-0 bg-gray-700 bg-opacity-25" onClick={() => setUserDialogMode(false)}></div>
      }
      <header className="flex my-4 items-center">
        <StoreLogoIcon className="w-10 h-10 mx-2" />
        <span className="text-3xl">WorldWide Software Architecture Summit</span>
        <span className="flex-grow"></span>
        <div className="relative mr-4">
          <ShoppingCartIcon className="w-10 h-10 cursor-pointer" onClick={() => setCartDialogMode(!cartDialogMode)} />
          {cartDialogMode &&
            <div className="absolute top-10 -inset-x-10 bg-white px-3 pb-3 border border-gray-400 text-center rounded-md">
              <div className="absolute top-0 w-4 h-4 transform rotate-45 -translate-y-2 inset-x-1/2 -translate-x-1/2 bg-white border-t border-l border-gray-400"></div>
              {shoppingCartList.map(cart => {
                return (
                  <div className="flex mt-2">
                    <img className="w-6 h-6 rounded-full" src={cart.ImageUrl} alt={cart.Name} />
                    <span className="flex-grow text-right">${cart.Price}</span>
                  </div>
                );
              })}
            </div>
          }
        </div>
        <div className="relative">
          {currentUser &&
          <img className="absolute w-10 h-10 cursor-pointer rounded-full" src={currentUser?.ProfilePictureUrl} onClick={() => setUserDialogMode(!userDialogMode)} alt={currentUser?.Name} title={currentUser?.Name} />
          }
          <UserIcon className="w-10 h-10 cursor-pointer" onClick={() => setUserDialogMode(!userDialogMode)} />
          {userDialogMode &&
            <div className="absolute top-10 -inset-x-10 bg-white p-3 border border-gray-400 text-center rounded-md">
              <div className="absolute top-0 w-4 h-4 transform rotate-45 -translate-y-2 inset-x-1/2 -translate-x-1/2 bg-white border-t border-l border-gray-400"></div>
              {currentUser === null ?
                <>
                  <input placeholder="username" type="text" value={userName} onChange={onUserNameChange} className="focus:outline-none w-full border shadow my-1" />
                  <input placeholder="password" type="password" value={password} onChange={onPasswordChange} className="focus:outline-none w-full border shadow my-1" />
                  <button className="border shadow bg-blue-400 text-white w-full whitespace-nowrap my-1" onClick={async () => {
                    const response = await fetch("/api/user/login", {
                      method: "POST",
                      body: JSON.stringify({ userName, password })
                    });
                    const data = await response.json();
                    setCurrentUser(data);
                  }}>Login</button>
                </> :
                <button className="border shadow bg-blue-400 text-white w-full whitespace-nowrap my-1" onClick={async () => {
                  setCurrentUser(null);
                  setUserDialogMode(false);
                }}>Logout</button>
              }
            </div>
          }
        </div>
      </header>
      <main className="flex-grow">
        <div className="bg-gray-300 rounded-xl mb-4 flex">
          <div className="flex-grow m-4">
            <h1 className="text-2xl">
              <span className="block text-gray-800">Online Shopping</span>
              <span className="block text-green-600">Buy to be happier 🥳</span>
            </h1>
            <p className="my-4 text-base text-gray-500 text-lg">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
            </p>
            <span className="inline-block cursor-pointer rounded-md shadow px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              Get started
            </span>
          </div>
          <img className="rounded-r-xl shadow" src="https://picsum.photos/300/200?color&random=2954" alt="Hero Section" />
        </div>
        <div className="flex items-center">
          <TagIcon className="w-6 h-6 mr-2" />
          <span className="text-xl">Discounted Products</span>
          <span className="flex-grow"></span>
          <span className="cursor-pointer" onClick={() => setPageProductList( pageProductList.length === 5 ? apiProductList : apiProductList.slice(0, 5))}>View all ▸</span>
        </div>
        <div className="grid grid-flow-row gap-x-4 grid-cols-5">
          {pageProductList.map((product, index) => {
            return (
              <div key={index} className="flex flex-col items-center bg-white shadow hover:shadow-lg rounded-xl mt-12">
                <img className="w-28 h-28 -mt-10 rounded-full border-2 border-gray-400 shadow" src={product.ImageUrl} alt={product.Name} />
                <div className="w-full h-full p-3">
                  <span className="text-lg">{ product.Name }</span>
                  <span className="flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    <span className="text-md">{ product.Rating } / 5</span>
                  </span>
                  <span className="text-lg">${ product.Price }</span>
                  <span className="text-lg">{ product.Rating }</span>
                </div>
                <button className="py-1 px-4 border border-gray-300 rounded-lg mb-4 shadow" onClick={() => {
                  setShoppingCartList([...shoppingCartList.concat(product)])
                }}>Add +</button>
              </div>
            );
          })}
        </div>
      </main>
      <footer className="my-4">
        Total {apiProductList.length} product found...
      </footer>
    </div>
  );
};
