"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频组件
 *
 * 自动播放策略（硬性要求）：
 * 1. 使用 IntersectionObserver 监测视频区域进入视口（threshold 0.5）
 * 2. 进入视口时自动加载并播放（autoplay=1&mute=1&loop=1）
 * 3. loop=1 必须配合 playlist=videoId 才能真正循环
 * 4. 未激活时显示 hqdefault 缩略图 + Play 按钮作为后备点击入口
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 进入视口后激活自动播放（autoplay=1&mute=1&loop=1&playlist=videoId）
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  const thumbnailUrl = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  useEffect(() => {
    if (activated || !containerRef.current) return;

    // 尊重用户的「减少动态效果」偏好，直接激活以避免延迟
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActivated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activated]);

  const handlePlay = () => setActivated(true);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${title}`}
            className="group absolute top-0 left-0 flex h-full w-full items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute top-0 left-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg shadow-[hsl(var(--nav-theme)/0.4)] transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 text-white" fill="currentColor" />
            </span>
            <span className="absolute bottom-4 left-4 right-4 z-10 text-left text-sm font-medium text-white/90 line-clamp-2 md:text-base">
              {title}
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
