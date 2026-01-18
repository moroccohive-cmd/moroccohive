"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface CTADialogProps {
    onInsert: (title: string, description: string, buttonText: string, buttonLink: string) => void
    onClose: () => void
}

export function CTADialog({ onInsert, onClose }: CTADialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [buttonText, setButtonText] = useState("Get Started")
    const [buttonLink, setButtonLink] = useState("/plan-trip")

    const handleInsert = () => {
        if (!title.trim() || !description.trim() || !buttonText.trim() || !buttonLink.trim()) {
            alert("Please fill in all fields")
            return
        }
        onInsert(title, description, buttonText, buttonLink)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Insert Call-to-Action</h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="cta-title">Title *</Label>
                        <Input
                            id="cta-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Plan your trip to Morocco"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cta-description">Description *</Label>
                        <Textarea
                            id="cta-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Chat with a local specialist who can help organize your trip."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="cta-button-text">Button Text *</Label>
                        <Input
                            id="cta-button-text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Get Started"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cta-button-link">Button Link *</Label>
                        <Input
                            id="cta-button-link"
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            placeholder="/plan-trip"
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleInsert}
                        className="flex-1"
                    >
                        Insert CTA
                    </Button>
                </div>
            </div>
        </div>
    )
}
