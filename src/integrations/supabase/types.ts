export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_ads: {
        Row: {
          created_at: string;
          enabled: boolean;
          ends_at: string | null;
          html: string | null;
          id: string;
          image_url: string | null;
          name: string;
          slot: string;
          starts_at: string | null;
          target_url: string | null;
          updated_at: string;
          weight: number;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          ends_at?: string | null;
          html?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          slot: string;
          starts_at?: string | null;
          target_url?: string | null;
          updated_at?: string;
          weight?: number;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          ends_at?: string | null;
          html?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          slot?: string;
          starts_at?: string | null;
          target_url?: string | null;
          updated_at?: string;
          weight?: number;
        };
        Relationships: [];
      };
      admin_articles: {
        Row: {
          author_id: string | null;
          category: string | null;
          content_md: string;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          lang: string;
          published_at: string | null;
          schema_json: Json;
          seo: Json;
          slug: string;
          status: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          category?: string | null;
          content_md?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          lang?: string;
          published_at?: string | null;
          schema_json?: Json;
          seo?: Json;
          slug: string;
          status?: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          category?: string | null;
          content_md?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          lang?: string;
          published_at?: string | null;
          schema_json?: Json;
          seo?: Json;
          slug?: string;
          status?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_festivals: {
        Row: {
          aarti: string | null;
          affiliate_products: Json;
          alt_names: string[];
          audio: Json;
          author_id: string | null;
          bhajans: Json;
          category: string | null;
          chalisa: string | null;
          created_at: string;
          date_type: string;
          deities: string[];
          description: string | null;
          detailed_description: string | null;
          donation_cta: Json | null;
          downloadables: Json;
          dress_colors: Json;
          duration_days: number;
          event_date: string | null;
          faqs: Json;
          featured_image: string | null;
          fixed_day: number | null;
          fixed_month: number | null;
          gallery: Json;
          history: string | null;
          id: string;
          images: string[];
          is_featured: boolean;
          is_multi_day: boolean;
          is_popular: boolean;
          is_recurring: boolean;
          is_trending: boolean;
          lunar_rule: Json | null;
          mantras: Json;
          mythological_story: string | null;
          name: string;
          pdfs: Json;
          prasad: string | null;
          preparation: string | null;
          publish_at: string | null;
          published: boolean;
          puja_vidhi: string | null;
          region_rules: Json;
          regional_variations: Json;
          related_articles: string[];
          related_festivals: string[];
          related_tools: string[];
          samagri: Json;
          seo: Json;
          short_description: string | null;
          significance: string | null;
          slug: string;
          solar_rule: Json | null;
          status: string;
          stotra: string | null;
          sub_category: string | null;
          tags: string[];
          timezone: string;
          unpublish_at: string | null;
          updated_at: string;
          updated_by: string | null;
          version: number;
          videos: Json;
          vrat_rules: Json;
          why_celebrated: string | null;
          year_overrides: Json;
        };
        Insert: {
          aarti?: string | null;
          affiliate_products?: Json;
          alt_names?: string[];
          audio?: Json;
          author_id?: string | null;
          bhajans?: Json;
          category?: string | null;
          chalisa?: string | null;
          created_at?: string;
          date_type?: string;
          deities?: string[];
          description?: string | null;
          detailed_description?: string | null;
          donation_cta?: Json | null;
          downloadables?: Json;
          dress_colors?: Json;
          duration_days?: number;
          event_date?: string | null;
          faqs?: Json;
          featured_image?: string | null;
          fixed_day?: number | null;
          fixed_month?: number | null;
          gallery?: Json;
          history?: string | null;
          id?: string;
          images?: string[];
          is_featured?: boolean;
          is_multi_day?: boolean;
          is_popular?: boolean;
          is_recurring?: boolean;
          is_trending?: boolean;
          lunar_rule?: Json | null;
          mantras?: Json;
          mythological_story?: string | null;
          name: string;
          pdfs?: Json;
          prasad?: string | null;
          preparation?: string | null;
          publish_at?: string | null;
          published?: boolean;
          puja_vidhi?: string | null;
          region_rules?: Json;
          regional_variations?: Json;
          related_articles?: string[];
          related_festivals?: string[];
          related_tools?: string[];
          samagri?: Json;
          seo?: Json;
          short_description?: string | null;
          significance?: string | null;
          slug: string;
          solar_rule?: Json | null;
          status?: string;
          stotra?: string | null;
          sub_category?: string | null;
          tags?: string[];
          timezone?: string;
          unpublish_at?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          videos?: Json;
          vrat_rules?: Json;
          why_celebrated?: string | null;
          year_overrides?: Json;
        };
        Update: {
          aarti?: string | null;
          affiliate_products?: Json;
          alt_names?: string[];
          audio?: Json;
          author_id?: string | null;
          bhajans?: Json;
          category?: string | null;
          chalisa?: string | null;
          created_at?: string;
          date_type?: string;
          deities?: string[];
          description?: string | null;
          detailed_description?: string | null;
          donation_cta?: Json | null;
          downloadables?: Json;
          dress_colors?: Json;
          duration_days?: number;
          event_date?: string | null;
          faqs?: Json;
          featured_image?: string | null;
          fixed_day?: number | null;
          fixed_month?: number | null;
          gallery?: Json;
          history?: string | null;
          id?: string;
          images?: string[];
          is_featured?: boolean;
          is_multi_day?: boolean;
          is_popular?: boolean;
          is_recurring?: boolean;
          is_trending?: boolean;
          lunar_rule?: Json | null;
          mantras?: Json;
          mythological_story?: string | null;
          name?: string;
          pdfs?: Json;
          prasad?: string | null;
          preparation?: string | null;
          publish_at?: string | null;
          published?: boolean;
          puja_vidhi?: string | null;
          region_rules?: Json;
          regional_variations?: Json;
          related_articles?: string[];
          related_festivals?: string[];
          related_tools?: string[];
          samagri?: Json;
          seo?: Json;
          short_description?: string | null;
          significance?: string | null;
          slug?: string;
          solar_rule?: Json | null;
          status?: string;
          stotra?: string | null;
          sub_category?: string | null;
          tags?: string[];
          timezone?: string;
          unpublish_at?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          videos?: Json;
          vrat_rules?: Json;
          why_celebrated?: string | null;
          year_overrides?: Json;
        };
        Relationships: [];
      };
      admin_temples: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string;
          history: string | null;
          id: string;
          lat: number | null;
          lng: number | null;
          name: string;
          opening_hours: Json;
          photos: string[];
          published: boolean;
          seo: Json;
          slug: string;
          state: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          history?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          name: string;
          opening_hours?: Json;
          photos?: string[];
          published?: boolean;
          seo?: Json;
          slug: string;
          state?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          history?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          name?: string;
          opening_hours?: Json;
          photos?: string[];
          published?: boolean;
          seo?: Json;
          slug?: string;
          state?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      affiliate_clicks: {
        Row: {
          country: string | null;
          created_at: string;
          id: string;
          link_id: string;
          referrer: string | null;
          user_agent: string | null;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          id?: string;
          link_id: string;
          referrer?: string | null;
          user_agent?: string | null;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          id?: string;
          link_id?: string;
          referrer?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "affiliate_links";
            referencedColumns: ["id"];
          },
        ];
      };
      affiliate_links: {
        Row: {
          active: boolean;
          category: string | null;
          clicks: number;
          conversions: number;
          created_at: string;
          id: string;
          network: string | null;
          product: string;
          updated_at: string;
          url: string;
        };
        Insert: {
          active?: boolean;
          category?: string | null;
          clicks?: number;
          conversions?: number;
          created_at?: string;
          id?: string;
          network?: string | null;
          product: string;
          updated_at?: string;
          url: string;
        };
        Update: {
          active?: boolean;
          category?: string | null;
          clicks?: number;
          conversions?: number;
          created_at?: string;
          id?: string;
          network?: string | null;
          product?: string;
          updated_at?: string;
          url?: string;
        };
        Relationships: [];
      };
      ai_feature_mappings: {
        Row: {
          created_at: string;
          enabled: boolean;
          fallback_provider_ids: string[];
          feature_key: string;
          id: string;
          model_name: string | null;
          notes: string | null;
          provider_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          fallback_provider_ids?: string[];
          feature_key: string;
          id?: string;
          model_name?: string | null;
          notes?: string | null;
          provider_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          fallback_provider_ids?: string[];
          feature_key?: string;
          id?: string;
          model_name?: string | null;
          notes?: string | null;
          provider_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_feature_mappings_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_models: {
        Row: {
          context_window: number | null;
          created_at: string;
          display_name: string | null;
          enabled: boolean;
          id: string;
          input_cost_per_1k: number | null;
          is_default: boolean;
          model_name: string;
          notes: string | null;
          output_cost_per_1k: number | null;
          provider_id: string;
          updated_at: string;
        };
        Insert: {
          context_window?: number | null;
          created_at?: string;
          display_name?: string | null;
          enabled?: boolean;
          id?: string;
          input_cost_per_1k?: number | null;
          is_default?: boolean;
          model_name: string;
          notes?: string | null;
          output_cost_per_1k?: number | null;
          provider_id: string;
          updated_at?: string;
        };
        Update: {
          context_window?: number | null;
          created_at?: string;
          display_name?: string | null;
          enabled?: boolean;
          id?: string;
          input_cost_per_1k?: number | null;
          is_default?: boolean;
          model_name?: string;
          notes?: string | null;
          output_cost_per_1k?: number | null;
          provider_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_prompt_versions: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          max_tokens: number | null;
          model: string | null;
          prompt_id: string;
          system_prompt: string | null;
          temperature: number | null;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          max_tokens?: number | null;
          model?: string | null;
          prompt_id: string;
          system_prompt?: string | null;
          temperature?: number | null;
          version: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          max_tokens?: number | null;
          model?: string | null;
          prompt_id?: string;
          system_prompt?: string | null;
          temperature?: number | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ai_prompt_versions_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "ai_prompts";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_prompts: {
        Row: {
          created_at: string;
          description: string | null;
          enabled: boolean;
          feature_key: string | null;
          id: string;
          max_tokens: number;
          model: string;
          name: string;
          system_prompt: string;
          temperature: number;
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          enabled?: boolean;
          feature_key?: string | null;
          id?: string;
          max_tokens?: number;
          model?: string;
          name: string;
          system_prompt: string;
          temperature?: number;
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          enabled?: boolean;
          feature_key?: string | null;
          id?: string;
          max_tokens?: number;
          model?: string;
          name?: string;
          system_prompt?: string;
          temperature?: number;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      ai_providers: {
        Row: {
          api_key: string | null;
          base_url: string | null;
          created_at: string;
          custom_headers: Json;
          custom_params: Json;
          default_model: string | null;
          enabled: boolean;
          id: string;
          is_default: boolean;
          last_tested_at: string | null;
          max_tokens: number | null;
          name: string;
          notes: string | null;
          organization_id: string | null;
          priority: number;
          project_id: string | null;
          provider_type: string;
          retry_attempts: number;
          retry_delay_ms: number;
          status: string;
          streaming: boolean;
          temperature: number | null;
          timeout_ms: number | null;
          top_p: number | null;
          updated_at: string;
        };
        Insert: {
          api_key?: string | null;
          base_url?: string | null;
          created_at?: string;
          custom_headers?: Json;
          custom_params?: Json;
          default_model?: string | null;
          enabled?: boolean;
          id?: string;
          is_default?: boolean;
          last_tested_at?: string | null;
          max_tokens?: number | null;
          name: string;
          notes?: string | null;
          organization_id?: string | null;
          priority?: number;
          project_id?: string | null;
          provider_type: string;
          retry_attempts?: number;
          retry_delay_ms?: number;
          status?: string;
          streaming?: boolean;
          temperature?: number | null;
          timeout_ms?: number | null;
          top_p?: number | null;
          updated_at?: string;
        };
        Update: {
          api_key?: string | null;
          base_url?: string | null;
          created_at?: string;
          custom_headers?: Json;
          custom_params?: Json;
          default_model?: string | null;
          enabled?: boolean;
          id?: string;
          is_default?: boolean;
          last_tested_at?: string | null;
          max_tokens?: number | null;
          name?: string;
          notes?: string | null;
          organization_id?: string | null;
          priority?: number;
          project_id?: string | null;
          provider_type?: string;
          retry_attempts?: number;
          retry_delay_ms?: number;
          status?: string;
          streaming?: boolean;
          temperature?: number | null;
          timeout_ms?: number | null;
          top_p?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          cost_estimate: number | null;
          created_at: string;
          error_message: string | null;
          feature_key: string | null;
          id: string;
          input_tokens: number | null;
          latency_ms: number | null;
          model_name: string | null;
          output_tokens: number | null;
          provider_id: string | null;
          provider_name: string | null;
          success: boolean;
          total_tokens: number | null;
          user_id: string | null;
        };
        Insert: {
          cost_estimate?: number | null;
          created_at?: string;
          error_message?: string | null;
          feature_key?: string | null;
          id?: string;
          input_tokens?: number | null;
          latency_ms?: number | null;
          model_name?: string | null;
          output_tokens?: number | null;
          provider_id?: string | null;
          provider_name?: string | null;
          success: boolean;
          total_tokens?: number | null;
          user_id?: string | null;
        };
        Update: {
          cost_estimate?: number | null;
          created_at?: string;
          error_message?: string | null;
          feature_key?: string | null;
          id?: string;
          input_tokens?: number | null;
          latency_ms?: number | null;
          model_name?: string | null;
          output_tokens?: number | null;
          provider_id?: string | null;
          provider_name?: string | null;
          success?: boolean;
          total_tokens?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
        ];
      };
      alert_events: {
        Row: {
          alert_id: string;
          id: number;
          payload: Json;
          triggered_at: string;
          value: number | null;
        };
        Insert: {
          alert_id: string;
          id?: number;
          payload?: Json;
          triggered_at?: string;
          value?: number | null;
        };
        Update: {
          alert_id?: string;
          id?: number;
          payload?: Json;
          triggered_at?: string;
          value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "alert_events_alert_id_fkey";
            columns: ["alert_id"];
            isOneToOne: false;
            referencedRelation: "analytics_alerts";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_alerts: {
        Row: {
          channel: string;
          condition: Json;
          created_at: string;
          created_by: string | null;
          enabled: boolean;
          id: string;
          kind: string;
          last_triggered_at: string | null;
          rule_name: string;
          threshold: number | null;
          updated_at: string;
        };
        Insert: {
          channel?: string;
          condition?: Json;
          created_at?: string;
          created_by?: string | null;
          enabled?: boolean;
          id?: string;
          kind: string;
          last_triggered_at?: string | null;
          rule_name: string;
          threshold?: number | null;
          updated_at?: string;
        };
        Update: {
          channel?: string;
          condition?: Json;
          created_at?: string;
          created_by?: string | null;
          enabled?: boolean;
          id?: string;
          kind?: string;
          last_triggered_at?: string | null;
          rule_name?: string;
          threshold?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      analytics_daily_rollup: {
        Row: {
          day: string;
          dimension: string;
          id: number;
          metric: string;
          updated_at: string;
          value: number;
        };
        Insert: {
          day: string;
          dimension?: string;
          id?: number;
          metric: string;
          updated_at?: string;
          value?: number;
        };
        Update: {
          day?: string;
          dimension?: string;
          id?: number;
          metric?: string;
          updated_at?: string;
          value?: number;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          browser: string | null;
          category: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          device: string | null;
          event_name: string;
          id: number;
          ip_hash: string | null;
          lang: string | null;
          meta: Json;
          os: string | null;
          path: string | null;
          referrer: string | null;
          region: string | null;
          screen: string | null;
          session_id: string;
          tool_slug: string | null;
          user_id: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          browser?: string | null;
          category?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          device?: string | null;
          event_name: string;
          id?: number;
          ip_hash?: string | null;
          lang?: string | null;
          meta?: Json;
          os?: string | null;
          path?: string | null;
          referrer?: string | null;
          region?: string | null;
          screen?: string | null;
          session_id: string;
          tool_slug?: string | null;
          user_id?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          browser?: string | null;
          category?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          device?: string | null;
          event_name?: string;
          id?: number;
          ip_hash?: string | null;
          lang?: string | null;
          meta?: Json;
          os?: string | null;
          path?: string | null;
          referrer?: string | null;
          region?: string | null;
          screen?: string | null;
          session_id?: string;
          tool_slug?: string | null;
          user_id?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      analytics_sessions: {
        Row: {
          browser: string | null;
          country: string | null;
          device: string | null;
          entry_path: string | null;
          is_bounce: boolean;
          lang: string | null;
          last_seen_at: string;
          os: string | null;
          pages: number;
          referrer: string | null;
          session_id: string;
          started_at: string;
          user_id: string | null;
        };
        Insert: {
          browser?: string | null;
          country?: string | null;
          device?: string | null;
          entry_path?: string | null;
          is_bounce?: boolean;
          lang?: string | null;
          last_seen_at?: string;
          os?: string | null;
          pages?: number;
          referrer?: string | null;
          session_id: string;
          started_at?: string;
          user_id?: string | null;
        };
        Update: {
          browser?: string | null;
          country?: string | null;
          device?: string | null;
          entry_path?: string | null;
          is_bounce?: boolean;
          lang?: string | null;
          last_seen_at?: string;
          os?: string | null;
          pages?: number;
          referrer?: string | null;
          session_id?: string;
          started_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_user_id: string | null;
          created_at: string;
          id: string;
          meta: Json;
          resource_id: string | null;
          resource_type: string;
        };
        Insert: {
          action: string;
          actor_user_id?: string | null;
          created_at?: string;
          id?: string;
          meta?: Json;
          resource_id?: string | null;
          resource_type: string;
        };
        Update: {
          action?: string;
          actor_user_id?: string | null;
          created_at?: string;
          id?: string;
          meta?: Json;
          resource_id?: string | null;
          resource_type?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          created_at: string;
          id: string;
          tool_slug: string;
          tool_title: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          tool_slug: string;
          tool_title?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          tool_slug?: string;
          tool_title?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          active: boolean;
          amount_off_cents: number | null;
          code: string;
          created_at: string;
          currency: string | null;
          id: string;
          max_redemptions: number | null;
          percent_off: number | null;
          redemptions: number;
          updated_at: string;
          valid_from: string | null;
          valid_to: string | null;
        };
        Insert: {
          active?: boolean;
          amount_off_cents?: number | null;
          code: string;
          created_at?: string;
          currency?: string | null;
          id?: string;
          max_redemptions?: number | null;
          percent_off?: number | null;
          redemptions?: number;
          updated_at?: string;
          valid_from?: string | null;
          valid_to?: string | null;
        };
        Update: {
          active?: boolean;
          amount_off_cents?: number | null;
          code?: string;
          created_at?: string;
          currency?: string | null;
          id?: string;
          max_redemptions?: number | null;
          percent_off?: number | null;
          redemptions?: number;
          updated_at?: string;
          valid_from?: string | null;
          valid_to?: string | null;
        };
        Relationships: [];
      };
      email_templates: {
        Row: {
          body_html: string;
          created_at: string;
          id: string;
          name: string;
          subject: string;
          updated_at: string;
          variables: Json;
        };
        Insert: {
          body_html: string;
          created_at?: string;
          id?: string;
          name: string;
          subject: string;
          updated_at?: string;
          variables?: Json;
        };
        Update: {
          body_html?: string;
          created_at?: string;
          id?: string;
          name?: string;
          subject?: string;
          updated_at?: string;
          variables?: Json;
        };
        Relationships: [];
      };
      family_members: {
        Row: {
          birth_date: string | null;
          birth_time: string | null;
          created_at: string;
          gender: string;
          id: string;
          is_favorite: boolean;
          latitude: number | null;
          longitude: number | null;
          name: string;
          notes: string | null;
          photo_url: string | null;
          place_name: string | null;
          relationship: string;
          timezone: string;
          tz_offset_minutes: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          birth_date?: string | null;
          birth_time?: string | null;
          created_at?: string;
          gender?: string;
          id?: string;
          is_favorite?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          name: string;
          notes?: string | null;
          photo_url?: string | null;
          place_name?: string | null;
          relationship?: string;
          timezone?: string;
          tz_offset_minutes?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          birth_date?: string | null;
          birth_time?: string | null;
          created_at?: string;
          gender?: string;
          id?: string;
          is_favorite?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          notes?: string | null;
          photo_url?: string | null;
          place_name?: string | null;
          relationship?: string;
          timezone?: string;
          tz_offset_minutes?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          id: string;
          item_id: string;
          item_type: string;
          metadata: Json | null;
          title: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_id: string;
          item_type: string;
          metadata?: Json | null;
          title?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_id?: string;
          item_type?: string;
          metadata?: Json | null;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      festival_date_cache: {
        Row: {
          computed_at: string;
          festival_id: string;
          id: string;
          lat: number | null;
          lng: number | null;
          occurrences: Json;
          year: number;
        };
        Insert: {
          computed_at?: string;
          festival_id: string;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          occurrences: Json;
          year: number;
        };
        Update: {
          computed_at?: string;
          festival_id?: string;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          occurrences?: Json;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "festival_date_cache_festival_id_fkey";
            columns: ["festival_id"];
            isOneToOne: false;
            referencedRelation: "admin_festivals";
            referencedColumns: ["id"];
          },
        ];
      };
      festival_revisions: {
        Row: {
          change_note: string | null;
          changed_by: string | null;
          created_at: string;
          festival_id: string;
          id: string;
          snapshot: Json;
          version: number;
        };
        Insert: {
          change_note?: string | null;
          changed_by?: string | null;
          created_at?: string;
          festival_id: string;
          id?: string;
          snapshot: Json;
          version: number;
        };
        Update: {
          change_note?: string | null;
          changed_by?: string | null;
          created_at?: string;
          festival_id?: string;
          id?: string;
          snapshot?: Json;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "festival_revisions_festival_id_fkey";
            columns: ["festival_id"];
            isOneToOne: false;
            referencedRelation: "admin_festivals";
            referencedColumns: ["id"];
          },
        ];
      };
      festival_tool_rules: {
        Row: {
          created_at: string;
          festival_id: string | null;
          id: string;
          match_category: string | null;
          match_deity: string | null;
          match_slug: string | null;
          note: string | null;
          priority: number;
          tool_slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          festival_id?: string | null;
          id?: string;
          match_category?: string | null;
          match_deity?: string | null;
          match_slug?: string | null;
          note?: string | null;
          priority?: number;
          tool_slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          festival_id?: string | null;
          id?: string;
          match_category?: string | null;
          match_deity?: string | null;
          match_slug?: string | null;
          note?: string | null;
          priority?: number;
          tool_slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "festival_tool_rules_festival_id_fkey";
            columns: ["festival_id"];
            isOneToOne: false;
            referencedRelation: "admin_festivals";
            referencedColumns: ["id"];
          },
        ];
      };
      festival_translations: {
        Row: {
          content: Json;
          created_at: string;
          festival_id: string;
          id: string;
          language: string;
          status: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          festival_id: string;
          id?: string;
          language: string;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          content?: Json;
          created_at?: string;
          festival_id?: string;
          id?: string;
          language?: string;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "festival_translations_festival_id_fkey";
            columns: ["festival_id"];
            isOneToOne: false;
            referencedRelation: "admin_festivals";
            referencedColumns: ["id"];
          },
        ];
      };
      history: {
        Row: {
          id: string;
          tool_slug: string;
          tool_title: string | null;
          user_id: string;
          visited_at: string;
        };
        Insert: {
          id?: string;
          tool_slug: string;
          tool_title?: string | null;
          user_id: string;
          visited_at?: string;
        };
        Update: {
          id?: string;
          tool_slug?: string;
          tool_title?: string | null;
          user_id?: string;
          visited_at?: string;
        };
        Relationships: [];
      };
      horoscope_history: {
        Row: {
          created_at: string;
          data: Json;
          family_member_id: string | null;
          id: string;
          kundli_id: string | null;
          language: string;
          period: string;
          sign: string | null;
          summary: string | null;
          target_date: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data?: Json;
          family_member_id?: string | null;
          id?: string;
          kundli_id?: string | null;
          language?: string;
          period?: string;
          sign?: string | null;
          summary?: string | null;
          target_date?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          family_member_id?: string | null;
          id?: string;
          kundli_id?: string | null;
          language?: string;
          period?: string;
          sign?: string | null;
          summary?: string | null;
          target_date?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "horoscope_history_family_member_id_fkey";
            columns: ["family_member_id"];
            isOneToOne: false;
            referencedRelation: "family_members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "horoscope_history_kundli_id_fkey";
            columns: ["kundli_id"];
            isOneToOne: false;
            referencedRelation: "user_kundlis";
            referencedColumns: ["id"];
          },
        ];
      };
      integration_settings: {
        Row: {
          config: Json;
          enabled: boolean;
          key: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          config?: Json;
          enabled?: boolean;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          config?: Json;
          enabled?: boolean;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      kundli_interpretations: {
        Row: {
          chart_hash: string;
          created_at: string;
          id: string;
          language: string;
          model: string | null;
          provider: string | null;
          section: string;
          text: string;
        };
        Insert: {
          chart_hash: string;
          created_at?: string;
          id?: string;
          language?: string;
          model?: string | null;
          provider?: string | null;
          section: string;
          text: string;
        };
        Update: {
          chart_hash?: string;
          created_at?: string;
          id?: string;
          language?: string;
          model?: string | null;
          provider?: string | null;
          section?: string;
          text?: string;
        };
        Relationships: [];
      };
      legal_contact_messages: {
        Row: {
          created_at: string;
          email: string;
          handled_at: string | null;
          handled_by: string | null;
          id: string;
          ip_hash: string | null;
          message: string;
          name: string;
          page_url: string | null;
          status: string;
          subject: string | null;
          topic: string;
          updated_at: string;
          user_agent: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: string;
          ip_hash?: string | null;
          message: string;
          name: string;
          page_url?: string | null;
          status?: string;
          subject?: string | null;
          topic?: string;
          updated_at?: string;
          user_agent?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: string;
          ip_hash?: string | null;
          message?: string;
          name?: string;
          page_url?: string | null;
          status?: string;
          subject?: string | null;
          topic?: string;
          updated_at?: string;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      legal_page_translations: {
        Row: {
          body_md: string;
          created_at: string;
          id: string;
          locale: string;
          page_id: string;
          seo_description: string | null;
          seo_title: string | null;
          status: string;
          subtitle: string | null;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          body_md?: string;
          created_at?: string;
          id?: string;
          locale: string;
          page_id: string;
          seo_description?: string | null;
          seo_title?: string | null;
          status?: string;
          subtitle?: string | null;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          body_md?: string;
          created_at?: string;
          id?: string;
          locale?: string;
          page_id?: string;
          seo_description?: string | null;
          seo_title?: string | null;
          status?: string;
          subtitle?: string | null;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "legal_page_translations_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "legal_pages";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_page_versions: {
        Row: {
          body_md: string;
          change_note: string | null;
          created_at: string;
          created_by: string | null;
          effective_date: string | null;
          id: string;
          locale: string;
          page_id: string;
          seo_description: string | null;
          seo_title: string | null;
          snapshot: Json;
          title: string;
          version: number;
        };
        Insert: {
          body_md: string;
          change_note?: string | null;
          created_at?: string;
          created_by?: string | null;
          effective_date?: string | null;
          id?: string;
          locale?: string;
          page_id: string;
          seo_description?: string | null;
          seo_title?: string | null;
          snapshot: Json;
          title: string;
          version: number;
        };
        Update: {
          body_md?: string;
          change_note?: string | null;
          created_at?: string;
          created_by?: string | null;
          effective_date?: string | null;
          id?: string;
          locale?: string;
          page_id?: string;
          seo_description?: string | null;
          seo_title?: string | null;
          snapshot?: Json;
          title?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "legal_page_versions_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "legal_pages";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_pages: {
        Row: {
          body_md: string;
          category: string;
          created_at: string;
          created_by: string | null;
          effective_date: string | null;
          id: string;
          is_system: boolean;
          last_updated_at: string;
          og_image: string | null;
          published_at: string | null;
          scheduled_at: string | null;
          schema_type: string;
          seo_description: string | null;
          seo_keywords: string | null;
          seo_title: string | null;
          slug: string;
          sort_order: number;
          status: string;
          subtitle: string | null;
          summary: string | null;
          title: string;
          toc: Json | null;
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          body_md?: string;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          effective_date?: string | null;
          id?: string;
          is_system?: boolean;
          last_updated_at?: string;
          og_image?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          schema_type?: string;
          seo_description?: string | null;
          seo_keywords?: string | null;
          seo_title?: string | null;
          slug: string;
          sort_order?: number;
          status?: string;
          subtitle?: string | null;
          summary?: string | null;
          title: string;
          toc?: Json | null;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          body_md?: string;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          effective_date?: string | null;
          id?: string;
          is_system?: boolean;
          last_updated_at?: string;
          og_image?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          schema_type?: string;
          seo_description?: string | null;
          seo_keywords?: string | null;
          seo_title?: string | null;
          slug?: string;
          sort_order?: number;
          status?: string;
          subtitle?: string | null;
          summary?: string | null;
          title?: string;
          toc?: Json | null;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          confirmed_at: string | null;
          created_at: string;
          email: string;
          id: string;
          source: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          confirmed_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          confirmed_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_channels: {
        Row: {
          channel: string;
          config: Json;
          enabled: boolean;
          label: string;
          provider: string;
          rate_limit_per_minute: number;
          sort_order: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          channel: string;
          config?: Json;
          enabled?: boolean;
          label: string;
          provider?: string;
          rate_limit_per_minute?: number;
          sort_order?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          channel?: string;
          config?: Json;
          enabled?: boolean;
          label?: string;
          provider?: string;
          rate_limit_per_minute?: number;
          sort_order?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      notification_deliveries: {
        Row: {
          channel: string;
          clicked_at: string | null;
          created_at: string;
          delivered_at: string | null;
          duration_ms: number | null;
          error_message: string | null;
          failed_at: string | null;
          id: string;
          language: string;
          meta: Json;
          provider: string | null;
          queue_id: string | null;
          read_at: string | null;
          recipient: string | null;
          retry_count: number;
          sent_at: string | null;
          status: string;
          subject: string | null;
          type: string;
          user_id: string | null;
        };
        Insert: {
          channel: string;
          clicked_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
          duration_ms?: number | null;
          error_message?: string | null;
          failed_at?: string | null;
          id?: string;
          language?: string;
          meta?: Json;
          provider?: string | null;
          queue_id?: string | null;
          read_at?: string | null;
          recipient?: string | null;
          retry_count?: number;
          sent_at?: string | null;
          status: string;
          subject?: string | null;
          type: string;
          user_id?: string | null;
        };
        Update: {
          channel?: string;
          clicked_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
          duration_ms?: number | null;
          error_message?: string | null;
          failed_at?: string | null;
          id?: string;
          language?: string;
          meta?: Json;
          provider?: string | null;
          queue_id?: string | null;
          read_at?: string | null;
          recipient?: string | null;
          retry_count?: number;
          sent_at?: string | null;
          status?: string;
          subject?: string | null;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          ai_recommendations: boolean;
          billing_alerts: boolean;
          browser_enabled: boolean;
          created_at: string;
          email_enabled: boolean;
          festival_alerts: boolean;
          horoscope_alerts: boolean;
          in_app_enabled: boolean;
          language: string;
          marketing_emails: boolean;
          monthly_digest: boolean;
          muhurat_alerts: boolean;
          panchang_alerts: boolean;
          push_enabled: boolean;
          push_subscription: Json | null;
          quiet_hours_enabled: boolean;
          quiet_hours_end: number;
          quiet_hours_start: number;
          report_alerts: boolean;
          timezone: string;
          unsubscribed_all: boolean;
          updated_at: string;
          user_id: string;
          weekly_digest: boolean;
        };
        Insert: {
          ai_recommendations?: boolean;
          billing_alerts?: boolean;
          browser_enabled?: boolean;
          created_at?: string;
          email_enabled?: boolean;
          festival_alerts?: boolean;
          horoscope_alerts?: boolean;
          in_app_enabled?: boolean;
          language?: string;
          marketing_emails?: boolean;
          monthly_digest?: boolean;
          muhurat_alerts?: boolean;
          panchang_alerts?: boolean;
          push_enabled?: boolean;
          push_subscription?: Json | null;
          quiet_hours_enabled?: boolean;
          quiet_hours_end?: number;
          quiet_hours_start?: number;
          report_alerts?: boolean;
          timezone?: string;
          unsubscribed_all?: boolean;
          updated_at?: string;
          user_id: string;
          weekly_digest?: boolean;
        };
        Update: {
          ai_recommendations?: boolean;
          billing_alerts?: boolean;
          browser_enabled?: boolean;
          created_at?: string;
          email_enabled?: boolean;
          festival_alerts?: boolean;
          horoscope_alerts?: boolean;
          in_app_enabled?: boolean;
          language?: string;
          marketing_emails?: boolean;
          monthly_digest?: boolean;
          muhurat_alerts?: boolean;
          panchang_alerts?: boolean;
          push_enabled?: boolean;
          push_subscription?: Json | null;
          quiet_hours_enabled?: boolean;
          quiet_hours_end?: number;
          quiet_hours_start?: number;
          report_alerts?: boolean;
          timezone?: string;
          unsubscribed_all?: boolean;
          updated_at?: string;
          user_id?: string;
          weekly_digest?: boolean;
        };
        Relationships: [];
      };
      notification_queue: {
        Row: {
          attempts: number;
          body: string | null;
          channel: string;
          created_at: string;
          created_by: string | null;
          dedupe_key: string | null;
          id: string;
          language: string;
          last_error: string | null;
          link: string | null;
          locked_at: string | null;
          max_attempts: number;
          payload: Json;
          priority: number;
          recipient: string | null;
          scheduled_at: string;
          status: string;
          subject: string | null;
          type: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          attempts?: number;
          body?: string | null;
          channel: string;
          created_at?: string;
          created_by?: string | null;
          dedupe_key?: string | null;
          id?: string;
          language?: string;
          last_error?: string | null;
          link?: string | null;
          locked_at?: string | null;
          max_attempts?: number;
          payload?: Json;
          priority?: number;
          recipient?: string | null;
          scheduled_at?: string;
          status?: string;
          subject?: string | null;
          type: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          attempts?: number;
          body?: string | null;
          channel?: string;
          created_at?: string;
          created_by?: string | null;
          dedupe_key?: string | null;
          id?: string;
          language?: string;
          last_error?: string | null;
          link?: string | null;
          locked_at?: string | null;
          max_attempts?: number;
          payload?: Json;
          priority?: number;
          recipient?: string | null;
          scheduled_at?: string;
          status?: string;
          subject?: string | null;
          type?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      notification_schedules: {
        Row: {
          audience: Json;
          cadence: string;
          channels: string[];
          created_at: string;
          created_by: string | null;
          day_of_month: number | null;
          day_of_week: number | null;
          enabled: boolean;
          id: string;
          last_run_at: string | null;
          name: string;
          next_run_at: string | null;
          payload: Json;
          run_at_hour: number;
          run_at_minute: number;
          timezone: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          audience?: Json;
          cadence?: string;
          channels?: string[];
          created_at?: string;
          created_by?: string | null;
          day_of_month?: number | null;
          day_of_week?: number | null;
          enabled?: boolean;
          id?: string;
          last_run_at?: string | null;
          name: string;
          next_run_at?: string | null;
          payload?: Json;
          run_at_hour?: number;
          run_at_minute?: number;
          timezone?: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          audience?: Json;
          cadence?: string;
          channels?: string[];
          created_at?: string;
          created_by?: string | null;
          day_of_month?: number | null;
          day_of_week?: number | null;
          enabled?: boolean;
          id?: string;
          last_run_at?: string | null;
          name?: string;
          next_run_at?: string | null;
          payload?: Json;
          run_at_hour?: number;
          run_at_minute?: number;
          timezone?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_template_versions: {
        Row: {
          changed_by: string | null;
          created_at: string;
          id: string;
          snapshot: Json;
          template_id: string;
          version: number;
        };
        Insert: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          snapshot: Json;
          template_id: string;
          version: number;
        };
        Update: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          snapshot?: Json;
          template_id?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "notification_template_versions_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "notification_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_templates: {
        Row: {
          body_html: string | null;
          body_md: string;
          body_text: string | null;
          channel: string;
          created_at: string;
          enabled: boolean;
          id: string;
          language: string;
          link: string | null;
          subject: string;
          type: string;
          updated_at: string;
          updated_by: string | null;
          variables: Json;
          version: number;
        };
        Insert: {
          body_html?: string | null;
          body_md?: string;
          body_text?: string | null;
          channel: string;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          language?: string;
          link?: string | null;
          subject?: string;
          type: string;
          updated_at?: string;
          updated_by?: string | null;
          variables?: Json;
          version?: number;
        };
        Update: {
          body_html?: string | null;
          body_md?: string;
          body_text?: string | null;
          channel?: string;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          language?: string;
          link?: string | null;
          subject?: string;
          type?: string;
          updated_at?: string;
          updated_by?: string | null;
          variables?: Json;
          version?: number;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          category: string | null;
          created_at: string;
          id: string;
          link: string | null;
          read: boolean;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read?: boolean;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read?: boolean;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          amount_cents: number;
          created_at: string;
          currency: string;
          customer_email: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          gateway_id: string | null;
          id: string;
          notes: Json;
          plan_id: string | null;
          product_type: string;
          provider: string;
          provider_order_id: string | null;
          provider_payment_id: string | null;
          provider_signature: string | null;
          status: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          gateway_id?: string | null;
          id?: string;
          notes?: Json;
          plan_id?: string | null;
          product_type?: string;
          provider?: string;
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          provider_signature?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          gateway_id?: string | null;
          id?: string;
          notes?: Json;
          plan_id?: string | null;
          product_type?: string;
          provider?: string;
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          provider_signature?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_gateway_id_fkey";
            columns: ["gateway_id"];
            isOneToOne: false;
            referencedRelation: "payment_gateways";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_gateway_id_fkey";
            columns: ["gateway_id"];
            isOneToOne: false;
            referencedRelation: "public_payment_gateways";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "subscription_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      panchang_providers: {
        Row: {
          cache_ttl_minutes: number;
          config: Json;
          created_at: string;
          enabled: boolean;
          id: string;
          name: string;
          priority: number;
          updated_at: string;
        };
        Insert: {
          cache_ttl_minutes?: number;
          config?: Json;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          name: string;
          priority?: number;
          updated_at?: string;
        };
        Update: {
          cache_ttl_minutes?: number;
          config?: Json;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          name?: string;
          priority?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_gateways: {
        Row: {
          active: boolean;
          created_at: string;
          credentials: Json;
          display_name: string;
          id: string;
          is_default: boolean;
          mode: string;
          notes: string | null;
          provider: string;
          public_config: Json;
          sort_order: number;
          supported_currencies: string[];
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          credentials?: Json;
          display_name: string;
          id?: string;
          is_default?: boolean;
          mode?: string;
          notes?: string | null;
          provider: string;
          public_config?: Json;
          sort_order?: number;
          supported_currencies?: string[];
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          credentials?: Json;
          display_name?: string;
          id?: string;
          is_default?: boolean;
          mode?: string;
          notes?: string | null;
          provider?: string;
          public_config?: Json;
          sort_order?: number;
          supported_currencies?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      pdf_reports: {
        Row: {
          bytes: number;
          created_at: string;
          download_count: number;
          filename: string;
          id: string;
          language: string;
          meta: Json;
          pages: number;
          report: string;
          storage_path: string | null;
          template_id: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          bytes?: number;
          created_at?: string;
          download_count?: number;
          filename?: string;
          id?: string;
          language?: string;
          meta?: Json;
          pages?: number;
          report: string;
          storage_path?: string | null;
          template_id?: string | null;
          title?: string;
          user_id: string;
        };
        Update: {
          bytes?: number;
          created_at?: string;
          download_count?: number;
          filename?: string;
          id?: string;
          language?: string;
          meta?: Json;
          pages?: number;
          report?: string;
          storage_path?: string | null;
          template_id?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pdf_reports_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "pdf_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      pdf_templates: {
        Row: {
          config: Json;
          created_at: string;
          id: string;
          is_default: boolean;
          language: string;
          name: string;
          report: string;
          sections: Json;
          status: string;
          theme: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          config?: Json;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          language?: string;
          name: string;
          report: string;
          sections?: Json;
          status?: string;
          theme?: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          config?: Json;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          language?: string;
          name?: string;
          report?: string;
          sections?: Json;
          status?: string;
          theme?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      pdf_themes: {
        Row: {
          config: Json;
          created_at: string;
          enabled: boolean;
          id: string;
          label: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          config?: Json;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          label: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          config?: Json;
          created_at?: string;
          enabled?: boolean;
          id?: string;
          label?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          language: string | null;
          location: string | null;
          timezone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          language?: string | null;
          location?: string | null;
          timezone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          language?: string | null;
          location?: string | null;
          timezone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      redirects: {
        Row: {
          code: number;
          created_at: string;
          enabled: boolean;
          from_path: string;
          id: string;
          to_path: string;
          updated_at: string;
        };
        Insert: {
          code?: number;
          created_at?: string;
          enabled?: boolean;
          from_path: string;
          id?: string;
          to_path: string;
          updated_at?: string;
        };
        Update: {
          code?: number;
          created_at?: string;
          enabled?: boolean;
          from_path?: string;
          id?: string;
          to_path?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      report_downloads: {
        Row: {
          created_at: string;
          filename: string;
          id: string;
          language: string;
          pdf_report_id: string | null;
          report_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          filename?: string;
          id?: string;
          language?: string;
          pdf_report_id?: string | null;
          report_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          filename?: string;
          id?: string;
          language?: string;
          pdf_report_id?: string | null;
          report_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_downloads_pdf_report_id_fkey";
            columns: ["pdf_report_id"];
            isOneToOne: false;
            referencedRelation: "pdf_reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_downloads_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "user_reports";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_mantras: {
        Row: {
          created_at: string;
          current_count: number;
          id: string;
          meaning: string | null;
          note: string | null;
          target_count: number | null;
          text: string | null;
          title: string;
          transliteration: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_count?: number;
          id?: string;
          meaning?: string | null;
          note?: string | null;
          target_count?: number | null;
          text?: string | null;
          title: string;
          transliteration?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_count?: number;
          id?: string;
          meaning?: string | null;
          note?: string | null;
          target_count?: number | null;
          text?: string | null;
          title?: string;
          transliteration?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      search_queries: {
        Row: {
          created_at: string;
          id: number;
          lang: string | null;
          path: string | null;
          query: string;
          results_count: number;
          session_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          lang?: string | null;
          path?: string | null;
          query: string;
          results_count?: number;
          session_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          lang?: string | null;
          path?: string | null;
          query?: string;
          results_count?: number;
          session_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          is_public: boolean;
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          is_public?: boolean;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Update: {
          is_public?: boolean;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      streaks: {
        Row: {
          current_streak: number;
          last_active_date: string | null;
          longest_streak: number;
          total_days: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          current_streak?: number;
          last_active_date?: string | null;
          longest_streak?: number;
          total_days?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          current_streak?: number;
          last_active_date?: string | null;
          longest_streak?: number;
          total_days?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      subscription_plans: {
        Row: {
          active: boolean;
          created_at: string;
          cta_label: string | null;
          currency: string;
          description: string | null;
          download_url: string | null;
          entitlement_key: string | null;
          featured: boolean;
          features: Json;
          id: string;
          interval: string;
          name: string;
          price_cents: number;
          product_type: string;
          provider: string | null;
          provider_price_id: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          cta_label?: string | null;
          currency?: string;
          description?: string | null;
          download_url?: string | null;
          entitlement_key?: string | null;
          featured?: boolean;
          features?: Json;
          id?: string;
          interval?: string;
          name: string;
          price_cents?: number;
          product_type?: string;
          provider?: string | null;
          provider_price_id?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          cta_label?: string | null;
          currency?: string;
          description?: string | null;
          download_url?: string | null;
          entitlement_key?: string | null;
          featured?: boolean;
          features?: Json;
          id?: string;
          interval?: string;
          name?: string;
          price_cents?: number;
          product_type?: string;
          provider?: string | null;
          provider_price_id?: string | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      tool_overrides: {
        Row: {
          created_at: string;
          featured: boolean;
          related_slugs: string[];
          seo: Json;
          slug: string;
          sort_order: number;
          status: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          featured?: boolean;
          related_slugs?: string[];
          seo?: Json;
          slug: string;
          sort_order?: number;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          featured?: boolean;
          related_slugs?: string[];
          seo?: Json;
          slug?: string;
          sort_order?: number;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      translation_queue: {
        Row: {
          created_at: string;
          error_message: string | null;
          id: string;
          key: string;
          lang: string;
          requested_by: string | null;
          reviewed_by: string | null;
          source_lang: string;
          source_value: string;
          status: string;
          suggested_value: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          key: string;
          lang: string;
          requested_by?: string | null;
          reviewed_by?: string | null;
          source_lang?: string;
          source_value: string;
          status?: string;
          suggested_value?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          key?: string;
          lang?: string;
          requested_by?: string | null;
          reviewed_by?: string | null;
          source_lang?: string;
          source_value?: string;
          status?: string;
          suggested_value?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      translation_versions: {
        Row: {
          created_at: string;
          id: string;
          key: string;
          lang: string;
          source: string;
          translation_id: string;
          updated_by: string | null;
          value: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          key: string;
          lang: string;
          source?: string;
          translation_id: string;
          updated_by?: string | null;
          value: string;
          version: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          key?: string;
          lang?: string;
          source?: string;
          translation_id?: string;
          updated_by?: string | null;
          value?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "translation_versions_translation_id_fkey";
            columns: ["translation_id"];
            isOneToOne: false;
            referencedRelation: "translations";
            referencedColumns: ["id"];
          },
        ];
      };
      translations: {
        Row: {
          created_at: string;
          id: string;
          key: string;
          lang: string;
          status: string;
          updated_at: string;
          updated_by: string | null;
          value: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          key: string;
          lang: string;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
          value: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          key?: string;
          lang?: string;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: string;
          version?: number;
        };
        Relationships: [];
      };
      user_activity_log: {
        Row: {
          action: string;
          created_at: string;
          id: number;
          meta: Json;
          resource_id: string | null;
          resource_type: string;
          user_id: string;
        };
        Insert: {
          action: string;
          created_at?: string;
          id?: number;
          meta?: Json;
          resource_id?: string | null;
          resource_type?: string;
          user_id: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          id?: number;
          meta?: Json;
          resource_id?: string | null;
          resource_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_devices: {
        Row: {
          created_at: string;
          device_label: string;
          id: string;
          last_seen_at: string;
          platform: string | null;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          device_label?: string;
          id?: string;
          last_seen_at?: string;
          platform?: string | null;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          device_label?: string;
          id?: string;
          last_seen_at?: string;
          platform?: string | null;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_entitlements: {
        Row: {
          active: boolean;
          created_at: string;
          entitlement_key: string;
          expires_at: string | null;
          id: string;
          order_id: string | null;
          plan_id: string | null;
          source: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          entitlement_key: string;
          expires_at?: string | null;
          id?: string;
          order_id?: string | null;
          plan_id?: string | null;
          source?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          entitlement_key?: string;
          expires_at?: string | null;
          id?: string;
          order_id?: string | null;
          plan_id?: string | null;
          source?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_entitlements_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_entitlements_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "subscription_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      user_kundlis: {
        Row: {
          birth_date: string;
          birth_time: string;
          chart: Json;
          created_at: string;
          family_member_id: string | null;
          gender: string;
          id: string;
          is_archived: boolean;
          is_favorite: boolean;
          language: string;
          latitude: number;
          longitude: number;
          name: string;
          notes: string | null;
          place_name: string;
          tags: string[];
          timezone: string;
          tz_offset_minutes: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          birth_date: string;
          birth_time?: string;
          chart?: Json;
          created_at?: string;
          family_member_id?: string | null;
          gender?: string;
          id?: string;
          is_archived?: boolean;
          is_favorite?: boolean;
          language?: string;
          latitude?: number;
          longitude?: number;
          name: string;
          notes?: string | null;
          place_name?: string;
          tags?: string[];
          timezone?: string;
          tz_offset_minutes?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          birth_date?: string;
          birth_time?: string;
          chart?: Json;
          created_at?: string;
          family_member_id?: string | null;
          gender?: string;
          id?: string;
          is_archived?: boolean;
          is_favorite?: boolean;
          language?: string;
          latitude?: number;
          longitude?: number;
          name?: string;
          notes?: string | null;
          place_name?: string;
          tags?: string[];
          timezone?: string;
          tz_offset_minutes?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_kundlis_family_fk";
            columns: ["family_member_id"];
            isOneToOne: false;
            referencedRelation: "family_members";
            referencedColumns: ["id"];
          },
        ];
      };
      user_moderation: {
        Row: {
          banned: boolean;
          notes: string | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
          warnings: number;
        };
        Insert: {
          banned?: boolean;
          notes?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
          warnings?: number;
        };
        Update: {
          banned?: boolean;
          notes?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
          warnings?: number;
        };
        Relationships: [];
      };
      user_reports: {
        Row: {
          content_md: string | null;
          created_at: string;
          data: Json;
          family_member_id: string | null;
          id: string;
          is_favorite: boolean;
          is_shared: boolean;
          kind: string;
          kundli_id: string | null;
          language: string;
          pdf_report_id: string | null;
          share_token: string | null;
          status: string;
          title: string;
          updated_at: string;
          user_id: string;
          version: number;
        };
        Insert: {
          content_md?: string | null;
          created_at?: string;
          data?: Json;
          family_member_id?: string | null;
          id?: string;
          is_favorite?: boolean;
          is_shared?: boolean;
          kind: string;
          kundli_id?: string | null;
          language?: string;
          pdf_report_id?: string | null;
          share_token?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
          user_id: string;
          version?: number;
        };
        Update: {
          content_md?: string | null;
          created_at?: string;
          data?: Json;
          family_member_id?: string | null;
          id?: string;
          is_favorite?: boolean;
          is_shared?: boolean;
          kind?: string;
          kundli_id?: string | null;
          language?: string;
          pdf_report_id?: string | null;
          share_token?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_reports_family_member_id_fkey";
            columns: ["family_member_id"];
            isOneToOne: false;
            referencedRelation: "family_members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_reports_kundli_id_fkey";
            columns: ["kundli_id"];
            isOneToOne: false;
            referencedRelation: "user_kundlis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_reports_pdf_report_id_fkey";
            columns: ["pdf_report_id"];
            isOneToOne: false;
            referencedRelation: "pdf_reports";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          created_at: string;
          daily_reminder_time: string | null;
          festival_reminder_channels: string[];
          festival_reminder_lead_days: number[];
          festival_reminders_enabled: boolean;
          language: string;
          notifications_enabled: boolean;
          sound_enabled: boolean;
          theme: string;
          updated_at: string;
          user_id: string;
          vibration_enabled: boolean;
        };
        Insert: {
          created_at?: string;
          daily_reminder_time?: string | null;
          festival_reminder_channels?: string[];
          festival_reminder_lead_days?: number[];
          festival_reminders_enabled?: boolean;
          language?: string;
          notifications_enabled?: boolean;
          sound_enabled?: boolean;
          theme?: string;
          updated_at?: string;
          user_id: string;
          vibration_enabled?: boolean;
        };
        Update: {
          created_at?: string;
          daily_reminder_time?: string | null;
          festival_reminder_channels?: string[];
          festival_reminder_lead_days?: number[];
          festival_reminders_enabled?: boolean;
          language?: string;
          notifications_enabled?: boolean;
          sound_enabled?: boolean;
          theme?: string;
          updated_at?: string;
          user_id?: string;
          vibration_enabled?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      public_payment_gateways: {
        Row: {
          display_name: string | null;
          id: string | null;
          is_default: boolean | null;
          mode: string | null;
          provider: string | null;
          public_config: Json | null;
          sort_order: number | null;
          supported_currencies: string[] | null;
        };
        Insert: {
          display_name?: string | null;
          id?: string | null;
          is_default?: boolean | null;
          mode?: string | null;
          provider?: string | null;
          public_config?: Json | null;
          sort_order?: number | null;
          supported_currencies?: string[] | null;
        };
        Update: {
          display_name?: string | null;
          id?: string | null;
          is_default?: boolean | null;
          mode?: string | null;
          provider?: string | null;
          public_config?: Json | null;
          sort_order?: number | null;
          supported_currencies?: string[] | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_public_integrations: { Args: never; Returns: Json };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
      touch_streak: { Args: { _user_id: string }; Returns: undefined };
    };
    Enums: {
      app_role: "admin" | "user" | "super_admin" | "editor" | "content_manager";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "super_admin", "editor", "content_manager"],
    },
  },
} as const;
