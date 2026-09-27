'use client';

import {
  HeadshotHeader,
  PromptForm,
  StyleSelector,
} from '@/components/headshot';
import { PhotoUpload } from '@/components/headshot';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import {
  useGenerateHeadshots,
  useGetAvailableStyles,
} from '@/lib/hooks/useHeadshot';
import { getApiErrorMessage } from '@/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function HeadshotStudioPage() {
  // generate headshot hook
  const { mutate: generateHeadshots, isPending: isHeadshotGenerationg } =
    useGenerateHeadshots();
  // headshot styles hook
  const { data: headshotStyles } = useGetAvailableStyles();
  // style selection state
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  // customer prompt state
  const [customPrompt, setCustomPrompt] = useState<string | undefined>(
    undefined,
  );
  // file state
  const [selectedFile, setSelectedFile] = useState<File | undefined | null>(
    undefined,
  );
  // router
  const router = useRouter();

  // Methods
  async function handleGenerateHeadshot() {
    if (!selectedFile) {
      toast.add({
        type: 'error',
        title: 'File upload',
        description: 'Photo is required to process generation',
      });
      return;
    }

    if (selectedStyles.length === 0 && !customPrompt) {
      toast.add({
        type: 'error',
        title: 'Failed to process',
        description: 'Either styles or custom prompt is required',
      });
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedFile);

    if (selectedStyles.length > 0) {
      formData.append('selectedStyles', JSON.stringify(selectedStyles));
    }

    if (customPrompt) {
      formData.append('customPrompt', customPrompt);
    }

    console.log(formData.keys().toArray(), formData.values().toArray());
    generateHeadshots(formData, {
      onError(error) {
        toast.add({
          type: 'error',
          title: 'Failed',
          description: getApiErrorMessage(
            error,
            'Failed to generate headshots',
          ),
        });
      },
      onSuccess: (data) => {
        setSelectedFile(null);
        setSelectedStyles([]);
        setCustomPrompt(undefined);
        router.replace('/dashboard/user/headshots');
      },
    });
  }

  function onUploadSuccess(file: File) {
    setSelectedFile(file);
  }

  function onUploadError(error: string) {
    toast.add({ type: 'error', title: 'File upload', description: error });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <HeadshotHeader />
      {/* Container */}
      <div className="rounded-lg border border-border p-6 space-y-6">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Generate Headshots
          </h2>
        </div>
        {/* Photo Upload */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Upload Your Photo
            </label>
          </div>
          <PhotoUpload
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
          />
        </div>
        {/* Style Selection */}
        {headshotStyles && headshotStyles?.length > 0 && (
          <StyleSelector
            selectedStyles={selectedStyles}
            onStylesChange={setSelectedStyles}
            maxStyles={5}
            availableStyles={headshotStyles}
          />
        )}
        {/* Custom Prompt (Optional) */}
        <PromptForm
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
        />
        {/* Submit Button */}
        <Button onClick={handleGenerateHeadshot} className="w-full" size="lg">
          {isHeadshotGenerationg ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Headshots
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Generation typically takes 2-5 minutes
        </p>
      </div>
    </div>
  );
}

export default HeadshotStudioPage;
