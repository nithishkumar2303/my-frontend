import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import { Brain, Upload, Zap, Shield } from "lucide-react";

const Index = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: FileList) => {
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload an eye image before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(20); // Initial progress

    const formData = new FormData();
    formData.append("file", selectedFiles[0]);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setProgress(100);

      toast({
        title: "Prediction Complete",
        description: `Predicted Grade: ${data.prediction}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to analyze the image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-primary p-4 rounded-2xl">
            <Brain className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          AI-Powered Gland Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload eye images for instant Meibomian Gland Dysfunction detection and grading using advanced AI technology
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Easy Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Drag and drop your eye images with optional JSON annotations
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Instant Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get gland segmentation and dysfunction grading in seconds
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Clinical Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Professional-grade accuracy for clinical and research use
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Eye Images</CardTitle>
          <CardDescription>
            Upload high-quality eye images for Meibomian gland analysis. JPEG and PNG formats supported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            uploading={uploading}
            progress={progress}
          />

          {!uploading && (
            <div className="mt-6 flex justify-center">
              <Button 
                size="lg" 
                className="px-8"
                onClick={handleAnalyze}
                disabled={uploading}
              >
                Start Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
