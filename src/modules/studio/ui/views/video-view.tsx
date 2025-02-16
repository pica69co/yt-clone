import { FormSection } from "../sections/form-section";

interface videoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: videoViewProps) => {
  return (
    <div className="px-4 pt-2.5 max-w-screen-lg">
      {" "}
      <FormSection videoId={videoId} />{" "}
    </div>
  );
};
