import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

interface Line {
  begin: string;
  end: string;
  text: string;
}

interface Item {
  lines: Line[];
  order: number;
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);

  console.log(jsonData);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [audioSrc]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonContent = event.target?.result;

        setJsonData(JSON.parse(jsonContent as string));
      };
      reader.readAsText(file);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center bg-slate-200 p-2 rounded-md ">
        Audio-Text Sync Testing
      </h2>
      <div className="flex flex-col lg:flex-row gap-4 ">
        <div className="bg-slate-50 rounded-md p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="audio-input">Upload Audio File:</Label>
            <Input
              id="audio-input"
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="max-w-sm"
            />
            {audioSrc && <audio ref={audioRef} controls src={audioSrc} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="json-input">Upload JSON File:</Label>
            <Input
              id="json-input"
              type="file"
              accept=".json"
              onChange={handleJsonChange}
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="max-h-[85vh] lg:overflow-y-auto scroll-auto px-4">
          {jsonData &&
            jsonData.content.map((item: Item, index: number) => (
              <div key={index} className="mb-4">
                {item.lines.map((line: Line) => (
                  <p
                    key={line.begin}
                    className={
                      currentTime >= Number(line.begin) &&
                      currentTime < Number(line.end)
                        ? "text-red-500 text-xl"
                        : "text-lg"
                    }
                  >
                    {line.text.includes("\n") ? (
                      line.text
                        .split("\n")
                        .map((text: string, index: number) => {
                          return (
                            <span className="" key={index}>
                              {text}
                              <br />
                            </span>
                          );
                        })
                    ) : (
                      <span className="">{line.text}</span>
                    )}
                  </p>
                ))}
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default App;
