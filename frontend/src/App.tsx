import AlertsSectionHeader from "./components/AlertsSectionHeader";
import PrimaryButton from "./components/Buttons/PrimaryButton";
import UserCard from "./components/Cards/UserCard";

function App() {
  return (
    <main className="flex gap-2 h-screen">
      <section className="flex flex-col gap-2 p-6 w-1/4">
        <PrimaryButton title="Create Alert" onClick={() => {}} />
        <div className="w-full h-full flex flex-col justify-between">
          <div className="overflow-auto flex flex-col items-start justify-start gap-4 mt-2">
            <h1 className="text-xl text-[#978e8e] font-semibold">
              Recently Updated
            </h1>
          </div>
          <UserCard isLoggedIn={true} />
        </div>
      </section>
      <section className="w-full p-6">
        <AlertsSectionHeader />
      </section>
    </main>
  );
}

export default App;
