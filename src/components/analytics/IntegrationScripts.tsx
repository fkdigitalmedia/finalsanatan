import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicIntegrations } from "@/lib/integrations.functions";

/**
 * Injects GA4 (gtag.js) and Microsoft Clarity script tags into <head>
 * once, based on the enabled integrations configured in the admin panel.
 * Client-only; runs after hydration.
 */
export function IntegrationScripts() {
  const fn = useServerFn(getPublicIntegrations);
  const { data } = useQuery({
    queryKey: ["public-integrations"],
    queryFn: () => fn(),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data) return;
    const { ga4_measurement_id, clarity_project_id } = data;

    if (ga4_measurement_id && !document.getElementById("ga4-loader")) {
      const s1 = document.createElement("script");
      s1.id = "ga4-loader";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4_measurement_id)}`;
      document.head.appendChild(s1);

      const s2 = document.createElement("script");
      s2.id = "ga4-init";
      s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4_measurement_id}');`;
      document.head.appendChild(s2);
    }

    if (clarity_project_id && !document.getElementById("clarity-init")) {
      const s = document.createElement("script");
      s.id = "clarity-init";
      s.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity_project_id}");`;
      document.head.appendChild(s);
    }
  }, [data]);

  return null;
}
