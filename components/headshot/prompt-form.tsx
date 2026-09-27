import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type PropmptFormProps = {
  setCustomPrompt: (prompt: string) => void;
  customPrompt?: string;
};

export function PromptForm({
  setCustomPrompt,
  customPrompt,
}: PropmptFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="custom-prompt">Custom Prompt (Optional)</Label>
      <Textarea
        id="custom-prompt"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Enter a custom prompt to override the default style prompts. If left empty, default prompts will be used."
        rows={3}
      />
      <p className="text-xs text-muted-foreground">
        Leave empty to use default style prompts, or enter a custom prompt to
        apply to all selected styles
      </p>
    </div>
  );
}
