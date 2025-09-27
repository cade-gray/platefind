import { useEffect, useState } from "react";
import "./App.css";

interface Plate {
  id: number;
  state: string;
  country: string;
  design_name: string;
  design_description: string;
  design_reasoning: string;
}

function App() {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [checkedPlates, setCheckedPlates] = useState<Set<number>>(new Set());
  const [hasLoaded, setHasLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter plates based on search term
  const filteredPlates = plates.filter(
    (plate) =>
      plate.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.design_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.design_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load checked plates from localStorage on component mount
  useEffect(() => {
    const savedCheckedPlates = localStorage.getItem("checkedPlates");
    if (savedCheckedPlates) {
      try {
        const parsedCheckedPlates = JSON.parse(savedCheckedPlates);
        setCheckedPlates(new Set(parsedCheckedPlates));
      } catch (error) {
        console.error("Error parsing saved checked plates:", error);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save checked plates to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem(
        "checkedPlates",
        JSON.stringify(Array.from(checkedPlates))
      );
    }
  }, [checkedPlates, hasLoaded]);

  const handlePlateCheck = (plateId: number) => {
    setCheckedPlates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(plateId)) {
        newSet.delete(plateId);
      } else {
        newSet.add(plateId);
      }
      return newSet;
    });
  };

  const resetCheckedPlates = () => {
    setCheckedPlates(new Set());
    localStorage.removeItem("checkedPlates");
  };

  useEffect(() => {
    // Fetch all license plates from the api.platefind.app
    document.title = "Find All License Plates";
    fetch("https://api.platefind.app/plates")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched plates:", data);
        setPlates(data);
      })
      .catch((error) => {
        console.error("Error fetching plates:", error);
      });
  }, []);

  return (
    <>
      <div className="align-center flex min-h-screen flex-col items-center justify-center bg-green-200 p-4">
        <h1 className="text-3xl font-bold">Find All License Plates</h1>
        <p className="mt-4 text-lg">
          New Game Beta From{" "}
          <a
            href="https://cadegray.dev"
            className="text-blue-500 hover:underline"
          >
            Cade Gray
          </a>
        </p>

        {/* Search Section */}
        <div className="mt-6 w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search plates by state, design name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && filteredPlates.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              No plates found matching "{searchTerm}"
            </p>
          )}
        </div>

        {/* Progress and Reset Section */}
        <div className="mt-4 flex items-center gap-4">
          <div className="text-lg font-semibold">
            Progress: {checkedPlates.size}/{plates.length} plates found
            {searchTerm && (
              <span className="text-sm text-gray-600 ml-2">
                (showing {filteredPlates.length})
              </span>
            )}
          </div>
          <button
            onClick={resetCheckedPlates}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Reset Progress
          </button>
        </div>

        {/* Display All Plates */}
        <div className="mt-6 w-full max-w-4xl">
          {filteredPlates.map((plate) => (
            <div
              key={plate.id}
              className={`mb-4 rounded-lg bg-white p-6 shadow-md border-2 transition-colors ${
                checkedPlates.has(plate.id)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`plate-${plate.id}`}
                    checked={checkedPlates.has(plate.id)}
                    onChange={() => handlePlateCheck(plate.id)}
                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <h3 className="text-xl font-bold text-blue-500">
                    {plate.state}
                  </h3>
                  {checkedPlates.has(plate.id) && (
                    <span className="text-gray-800 font-semibold text-sm">
                      ✓ Found
                    </span>
                  )}
                </div>
              </div>
              <h4 className="text-lg font-semibold text-b-600 mb-2">
                {plate.design_name}
              </h4>
              <p className="text-gray-700 mb-2">{plate.design_description}</p>
              <p className="text-sm text-gray-600 italic">
                {plate.design_reasoning}
              </p>
              <div className="mt-2 text-xs text-gray-500">{plate.country}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
