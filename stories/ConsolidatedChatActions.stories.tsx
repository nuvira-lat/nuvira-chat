import { ChatSidebar } from "@/components/ConsolidatedChatActions";
import StarIcon from "@mui/icons-material/Star";
import { Button, Stack, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import {
  mockContact,
  mockContactNotes,
  mockWorkspace,
  mockCustomFunnel,
  mockCustomStage
} from "./fixtures";
import { CHAT_SIDEBAR_SECTIONS, CHAT_SIDEBAR_SIMPLE, CHAT_SIDEBAR_STANDARD } from "@/types";
import { createFetchMock } from "./mockFetch";

const meta: Meta<typeof ChatSidebar> = {
  title: "Components/Chat/ConsolidatedChatActions",
  component: ChatSidebar,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "custom-funnels": { stages: [mockCustomStage] },
        "contact/custom-funnel": { success: true },
        "contact/custom-stage": { success: true },
        "status/history": { statusHistory: [] },
        "contact-summary": { description: "AI summary" }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
      return (
        <Stack sx={{ p: 0, bgcolor: "grey.100", minWidth: "300px", height: "600px" }}>
          <Story />
        </Stack>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Configurable sidebar with accordion sections. Each section has a default icon; override via sectionConfig.icon or customSections[].icon. Use defaultExpandedSections or sectionConfig.defaultExpanded to control which sections are open on initial render."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatSidebar>;

const defaultArgs = {
  contact: mockContact,
  notes: mockContactNotes,
  workspace: mockWorkspace,
  funnels: [mockCustomFunnel]
};

/** Full sidebar with all sections (default behavior when sections is omitted) */
export const Default: Story = {
  args: defaultArgs
};

/** Simple chat: status only */
export const Simple: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_SIMPLE
  }
};

/** Standard chat: status, info editor, AI summary (no funnel or notes) */
export const Standard: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_STANDARD
  }
};

/** Full sidebar with all sections (explicit) */
export const Full: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_SECTIONS
  }
};

/** Sections expanded on initial render (status and AI Summary open) */
export const DefaultExpanded: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_SECTIONS,
    defaultExpandedSections: ["status", "aiSummary"]
  }
};

/** Per-section default expanded via sectionConfig */
export const PerSectionDefaultExpanded: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_SECTIONS,
    sectionConfig: {
      status: { defaultExpanded: true },
      notes: { defaultExpanded: true }
    }
  }
};

/** Custom icon for built-in section and custom section with icon */
export const WithCustomIcons: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_STANDARD,
    sectionConfig: {
      status: { icon: <StarIcon sx={{ fontSize: 20 }} /> }
    },
    customSections: [
      {
        id: "lead-score",
        title: "Lead Score",
        icon: <StarIcon sx={{ fontSize: 20 }} />,
        content: (
          <Typography variant="body2" color="text.secondary">
            Custom section with custom icon
          </Typography>
        ),
        position: "end",
        defaultExpanded: true
      }
    ]
  }
};

/** Custom section title for Funnel & Stage */
export const CustomTitle: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_SECTIONS,
    sectionConfig: {
      funnelStage: { title: "Sales Pipeline" }
    }
  }
};

/** Slot override: replace AI Summary with custom content */
export const WithSlot: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_SECTIONS,
    sectionConfig: {
      aiSummary: {
        slot: (
          <Typography variant="body2" color="text.secondary">
            Custom AI block – replace with your own component
          </Typography>
        )
      }
    }
  }
};

/** Custom section added to the sidebar */
export const WithCustomSection: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_STANDARD,
    customSections: [
      {
        id: "lead-score",
        title: "Lead Score",
        content: (
          <Typography variant="body2" color="text.secondary">
            Custom widget – e.g. Lead Score, Tags, Quick Actions
          </Typography>
        ),
        position: "end",
        defaultExpanded: true
      }
    ]
  }
};

/** Custom sections at both start and end */
export const WithCustomSectionsAtStartAndEnd: Story = {
  args: {
    ...defaultArgs,
    sections: CHAT_SIDEBAR_STANDARD,
    customSections: [
      {
        id: "quick-actions",
        title: "Quick Actions",
        content: <Button size="small">Send Template</Button>,
        position: "start"
      },
      {
        id: "lead-score",
        title: "Lead Score",
        content: (
          <Typography variant="body2" color="text.secondary">
            Score: 85
          </Typography>
        ),
        position: "end"
      }
    ]
  }
};
