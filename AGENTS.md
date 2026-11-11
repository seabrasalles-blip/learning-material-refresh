# Architecture rules

- Preserve TanStack file routing and existing SVG drawing components rather than replacing the application.
- Use a shared learning-screen shell and Mila pose component for consistent presentation; supplied image pointers remain separate from text, SVG geometry and interactive controls.
- Cover, introduction, selection, transition and conclusion use distinct leaf routes; session-only progress deduplicates figure/mode pairs and scopes indicators, opposite-mode invitations and conclusion guards to one figure, so unrelated figures never complete a cycle.
- Keep original figure coordinates immutable; model and response grids share the same coordinates, columns and rows — the scale factor applies only to the physical cell size (CELL_BASE in src/data/desafios.ts), never to the vertices.
- Validate line coverage with merged collinear intervals, not segment counts, so subdivision and drawing direction do not affect correctness.
- Keep fixed circles separate from student segment state, so drawing tools cannot delete supplied geometry.
- Remember demonstration viewing independently per mode only for the current browser session; this presentation state is separate from student progress and is not cleared by journey replay.
- Model seven cell rows and eight selectable vertex rows in both SVG grids; shared immutable figure data keeps labels and border endpoints consistent.
- Keep keyboard and pointer input on the same vertex-selection path, with a bounded keyboard cursor, so snapping and geometric validation cannot diverge.
- Reset the shared session progress only explicitly; choosing or replaying a figure and returning to the cover preserve the history, so exploration cannot erase earned completions.
- Erase by nearest student-segment index (pointer distance in screen pixels or keyboard selection), keeping supplied circles outside hit testing; coverage differences feed a separate contextual-guidance module so geometry and pedagogical copy stay independent.
- Version per-mode scale viewing separately from shared tool-tutorial completion, so legacy sessions receive new instruction; explicit example review can replay all three steps. Practice uses local DrawingGrid state and never writes activity strokes or progress; hints remain separate presentation state.
- Keep conceptual conclusion stages and answer evaluation in presentation-only state, separate from session transformation progress, so reflection retries cannot modify drawings or earned completions; example side measures never feed activity geometry.
