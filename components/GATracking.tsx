'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    AB_VARIANT?: 'A' | 'B';
    PAGE_LOAD_TIME?: number;
    FORM_START_TIME?: number;
    FORM_ERROR_COUNT?: number;
    INTERACTION_COUNT?: number;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-PLACEHOLDER';

export default function GATracking() {
  useEffect(() => {
    const gtag = (window as any).gtag;
    
    window.PAGE_LOAD_TIME = Date.now();
    window.FORM_ERROR_COUNT = 0;
    window.INTERACTION_COUNT = 0;

    if (!window.AB_VARIANT) {
      const sessionVariant = sessionStorage.getItem('ab_variant');
      if (sessionVariant) {
        window.AB_VARIANT = sessionVariant as 'A' | 'B';
      } else {
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        window.AB_VARIANT = variant;
        sessionStorage.setItem('ab_variant', variant);
      }
    }

    const isReturningVisitor = () => localStorage.getItem('visited') === 'true';
    const getDeviceCategory = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    if (gtag) {
      gtag('event', 'variant_impression', {
        variant: window.AB_VARIANT,
        site: 'agentic-dev',
        page_type: 'landing',
        user_type: isReturningVisitor() ? 'returning' : 'new',
        device_category: getDeviceCategory(),
      });
      localStorage.setItem('visited', 'true');
    }

    const trackFormFocus = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const form = target.closest('form');
      
      if (form && gtag) {
        gtag('event', 'form_field_focus', {
          field_name: target.name || 'unknown',
          form_id: form.id || 'unknown',
          variant: window.AB_VARIANT,
          time_to_focus_sec: Math.round((Date.now() - (window.PAGE_LOAD_TIME || Date.now())) / 1000),
        });
        if (!window.FORM_START_TIME) window.FORM_START_TIME = Date.now();
      }
    };

    const trackCTAClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.cta-button, .btn-primary, .btn-secondary, button[data-cta]');
      
      if (button && gtag) {
        const element = button as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        
        gtag('event', 'cta_click', {
          cta_text: element.textContent?.trim() || 'unknown',
          cta_position: element.getAttribute('data-position') || 'unknown',
          cta_color: computedStyle.backgroundColor,
          cta_size: element.getAttribute('data-size') || 'medium',
          link_destination: (element as HTMLAnchorElement).href || element.getAttribute('data-href') || 'unknown',
        });
      }
    };

    let depthsTracked = new Set<number>();
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      [25, 50, 75, 90].forEach((threshold) => {
        if (scrollPercent >= threshold && !depthsTracked.has(threshold) && gtag) {
          depthsTracked.add(threshold);
          gtag('event', 'scroll_depth', {
            depth_percent: threshold,
            time_to_depth_sec: Math.round((Date.now() - (window.PAGE_LOAD_TIME || Date.now())) / 1000),
            variant: window.AB_VARIANT,
          });
        }
      });
    };

    let exitTracked = false;
    const trackExitIntent = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (!exitTracked && mouseEvent.clientY < 10 && gtag) {
        exitTracked = true;
        const scrollMax = Math.round((window.scrollY / document.body.scrollHeight) * 100);
        gtag('event', 'exit_intent', {
          time_on_page_sec: Math.round((Date.now() - (window.PAGE_LOAD_TIME || Date.now())) / 1000),
          scroll_depth_at_exit: scrollMax,
          forms_interacted: !!document.querySelector('input:focus, textarea:focus'),
        });
      }
    };

    const trackBounce = () => {
      const timeOnPage = Math.round((Date.now() - (window.PAGE_LOAD_TIME || Date.now())) / 1000);
      const interactions = window.INTERACTION_COUNT || 0;
      const scrollMax = Math.round((window.scrollY / document.body.scrollHeight) * 100);
      if (timeOnPage < 10 && scrollMax < 25 && interactions === 0 && gtag) {
        gtag('event', 'bounce', {
          time_on_page_sec: timeOnPage,
          interactions,
          scroll_max_percent: scrollMax,
        });
      }
    };

    const trackInteraction = () => {
      window.INTERACTION_COUNT = (window.INTERACTION_COUNT || 0) + 1;
    };

    document.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('focus', trackFormFocus, { once: true });
    });

    document.addEventListener('click', trackCTAClick);
    document.addEventListener('click', trackInteraction);
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    document.addEventListener('mouseout', trackExitIntent);
    window.addEventListener('beforeunload', trackBounce);

    return () => {
      document.removeEventListener('click', trackCTAClick);
      document.removeEventListener('click', trackInteraction);
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('mouseout', trackExitIntent);
      window.removeEventListener('beforeunload', trackBounce);
    };
  }, []);

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
    </>
  );
}

export function trackFormSubmission(formType: string, fieldsCompleted: number, validationErrors: number = 0) {
  const gtag = (window as any).gtag;
  if (gtag) {
    const formTime = window.FORM_START_TIME 
      ? Math.round((Date.now() - window.FORM_START_TIME) / 1000)
      : 0;
    gtag('event', 'form_submission', {
      form_type: formType,
      fields_completed: fieldsCompleted,
      form_time_sec: formTime,
      validation_errors: validationErrors,
      submission_method: 'button_click',
      conversion_value: 500,
    });
  }
}
