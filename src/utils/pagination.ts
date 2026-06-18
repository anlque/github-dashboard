import type { PaginationMeta } from '@/types/pagination';

function parseLinkRelations(header: string): Record<string, string> {
  const relations: Record<string, string> = {};

  for (const segment of header.split(',')) {
    const match = segment.trim().match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      relations[match[2]] = match[1];
    }
  }

  return relations;
}

function getPageFromUrl(url: string): number | null {
  const page = new URL(url).searchParams.get('page');
  if (!page) return null;

  const parsed = Number(page);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildPaginationMeta(
  linkHeader: string | null,
  page: number,
  perPage: number,
): PaginationMeta {
  if (!linkHeader) {
    return {
      page,
      perPage,
      hasNext: false,
      hasPrev: page > 1,
      totalPages: page,
    };
  }

  const relations = parseLinkRelations(linkHeader);
  const totalPages = relations.last ? getPageFromUrl(relations.last) : null;

  return {
    page,
    perPage,
    hasNext: Boolean(relations.next),
    hasPrev: Boolean(relations.prev) || page > 1,
    totalPages,
  };
}
