import arrayProblems from './dsa/array';

export const aptitudeTopics = [
  {
    id: 'apt-quant-1',
    title: 'Number Systems & Basic Arithmetic',
    description: 'Integers, LCM/GCD, divisibility, remainders, modular arithmetic, percentages, ratios and simple & compound interest.',
    focus: ['Divisibility rules', 'Remainder tricks', 'Percent change', 'Mixtures and ratios'],
    examples: ['LCM/GCD based shortcuts', 'Repeated percentage growth', 'Remainders in cyclic patterns'],
    tips: ['Always simplify fractions before applying LCM/GCD', 'Convert percentages to decimals for quick multiplication', 'Use modular arithmetic for cyclic remainder problems'],
    formulas: ['LCM(a,b) = (a*b)/GCD(a,b)', 'Percent = (part/whole)*100', 'Simple interest = P * R * T / 100']
  },
  {
    id: 'apt-algebra-1',
    title: 'Algebra & Equations',
    description: 'Linear equations, quadratic equations, inequalities, sequences and series, exponentials, logarithms and problem solving.',
    focus: ['Linear systems', 'Quadratic roots', 'Inequality signs', 'Series and progression'],
    examples: ['Factorize before solving', 'Use substitution for two equations', 'Spot common sequence patterns'],
    tips: ['Check for common factors before factoring quadratics', 'Use the discriminant to quickly assess root types', 'Rewrite inequalities to isolate variables'],
    formulas: ['Quadratic formula: x = (-b ± √(b²-4ac))/(2a)', 'Geometric series sum: S = a₁(1-rⁿ)/(1-r)', 'Log rule: log_b(MN)=log_bM+log_bN']
  },
  {
    id: 'apt-prob-1',
    title: 'Probability & Combinatorics',
    description: 'Permutations & combinations, probability rules, expected value, counting principles, basic combinatorial reasoning.',
    focus: ['Counting principles', 'Permutation vs combination', 'Conditional probability', 'Expected value'],
    examples: ['Ordered selections', 'Independent events', 'Sample space construction'],
    tips: ['Use nPr for ordered selections, nCr for unordered', 'Remember P(A∩B)=P(A)P(B|A)', 'Expected value = Σ (outcome × probability)'],
    formulas: ['Permutation: P(n,k)=n!/(n-k)!', 'Combination: C(n,k)=n!/(k!(n-k)!)', 'Bayes theorem: P(A|B)=P(B|A)P(A)/P(B)']
  },
  {
    id: 'apt-geometry-1',
    title: 'Geometry & Mensuration',
    description: 'Angles, triangles, circles, coordinate geometry, area, volume, Pythagoras, similarity and congruence.',
    focus: ['Triangles', 'Circles', 'Area and volume', 'Coordinate geometry'],
    examples: ['Angle chasing', 'Similarity ratios', 'Distance formula questions'],
    tips: ['Draw auxiliary lines to reveal hidden angles', 'Use coordinate formulas for distance and midpoint', 'Recall area formulas for common shapes'],
    formulas: ['Area of triangle = ½*b*h', 'Circle area = πr²', 'Distance formula: √((x₂-x₁)²+(y₂-y₁)²)']
  },
  {
    id: 'apt-speed-1',
    title: 'Speed, Distance & Time',
    description: 'Relative speed, average speed, boats & streams, trains, time-distance problems, work and time.',
    focus: ['Relative speed', 'Average speed', 'Boats and streams', 'Work and time'],
    examples: ['Meeting point problems', 'Train crossing formulas', 'Combined work rates'],
    tips: ['Convert all speeds to the same unit before calculations', 'Use relative speed for opposing/ same direction problems', 'Remember work = rate × time'],
    formulas: ['Distance = Speed × Time', 'Relative speed (same direction) = |v₁ - v₂|', 'Work rate = 1/time']
  },
  {
    id: 'apt-data-1',
    title: 'Data Interpretation',
    description: 'Bar charts, line graphs, tables, pie charts and multi-step comparison questions.',
    focus: ['Chart reading', 'Percentage comparison', 'Trend analysis', 'Approximation'],
    examples: ['Tables with multiple categories', 'Mixed graph sets', 'Fast approximation drills'],
    tips: ['Estimate totals before precise calculations', 'Look for patterns in successive data points', 'Convert ratios to percentages for easier comparison'],
    formulas: ['Percentage change = (New - Old)/Old × 100', 'Average = Σ values / n', 'Linear interpolation formula']
  },
  {
    id: 'apt-logic-1',
    title: 'Commercial Maths & Logic',
    description: 'Profit and loss, discount, partnership, averages, ages, mixtures, and decision-based aptitude.',
    focus: ['Profit/loss', 'Averages', 'Ages', 'Mixture and allegation'],
    examples: ['Marked price and discount', 'Weighted averages', 'Age progression style questions'],
    tips: ['Always convert percentages to decimals', 'Use weighted average formula when multiple groups are involved', 'Set up simple equations for mixture problems'],
    formulas: ['Profit = Selling Price - Cost Price', 'Discounted price = MRP × (1 - discount%)', 'Weighted average = Σ (value × weight) / Σ weight']
  },
  {
    id: 'apt-numbertheory-1',
    title: 'Number Theory & Modular Arithmetic',
    description: 'Prime factors, divisibility, modular residues, remainder cycles, Chinese remainder ideas and basic congruences.',
    focus: ['Prime factorization', 'Modular cycles', 'Remainder patterns', 'Congruences'],
    examples: ['Remainders after large powers', 'CRT style alignment', 'Divisor counting'],
    tips: ['Use prime factorization to simplify GCD/LCD', 'Identify cycles in modular exponentiation', 'Apply CRT when multiple moduli are coprime'],
    formulas: ['Euler’s totient φ(n)=n∏(1-1/p)', 'Modular exponentiation: a^b mod m', 'Chinese Remainder Theorem for solving simultaneous congruences']
  },
  {
    id: 'apt-statistics-1',
    title: 'Statistics & Data Measures',
    description: 'Mean, median, mode, range, variance, standard deviation, and interpretation of small datasets.',
    focus: ['Mean/median/mode', 'Range/SD', 'Weighted averages', 'Data cleaning basics'],
    examples: ['Change in mean after replacement', 'Weighted mean puzzles', 'Quick SD estimation'],
    tips: ['Use shortcut formulas for variance', 'Remember median is the middle value after sorting', 'Weighted mean helps when items have different importance'],
    formulas: ['Mean = Σ x / n', 'Variance = Σ (x-μ)² / n', 'Standard deviation = √variance']
  },
  {
    id: 'apt-matrices-1',
    title: 'Matrices, Determinants & Linear Algebra basics',
    description: 'Basic matrix operations, determinants, solving small linear systems using matrix intuition and Cramer’s rule glimpses.',
    focus: ['Matrix multiplication', 'Determinants', 'Linear systems', 'Cramer rule basics'],
    examples: ['2x2 determinant tricks', 'Solve 2 equations with 2 unknowns using determinants'],
    tips: ['For 2x2 determinant, use ad-bc shortcut', 'Check if determinant is zero before using Cramer', 'Remember transpose swaps rows and columns'],
    formulas: ['Determinant of 2x2 = a*d - b*c', "Cramer’s rule: x_i = det(A_i)/det(A)", 'Matrix multiplication rule: (AB)_ij = Σ_k A_ik B_kj']
  },
  {
    id: 'apt-optimization-1',
    title: 'Linear Programming & Optimization',
    description: 'Feasible regions, objective functions, simple LP setups and intuitive optimization on inequalities.',
    focus: ['Feasible region', 'Graphical LP', 'Constraint handling', 'Objective evaluation'],
    examples: ['Maximize under two constraints', 'Corner point checking'],
    tips: ['Plot constraints to visualize feasible region', 'Evaluate objective at all corner points', 'Check for redundancy in constraints'],
    formulas: ['Objective function: Z = c₁x₁ + c₂x₂', 'Constraint: a₁x₁ + a₂x₂ ≤ b', 'Optimal solution occurs at a vertex of feasible region']
  }
  ,
  // IndiaBix style granular topics
  {
    id: 'apt-trains',
    title: 'Problems on Trains',
    description: 'Solve problems about trains crossing poles, platforms, bridges, or passing each other with relative speeds.',
    focus: ['Relative speed of moving trains', 'Crossing stationery objects (pole, man)', 'Crossing moving objects (bridges, platforms)', 'Opposite and same direction equations'],
    examples: ['Train crosses a 200m platform in 15 seconds', 'Two trains running in opposite directions pass each other', 'Calculate length of train given speed and crossing time'],
    tips: ['To convert km/hr to m/s, multiply speed by 5/18', 'To convert m/s to km/hr, multiply speed by 18/5', 'When a train crosses a pole or a stationary man, distance covered equals train length', 'When crossing a bridge, platform, or another train, distance covered equals train length plus the length of the bridge/platform/other train'],
    formulas: ['Speed = Distance / Time', 'Relative Speed (same direction) = u - v', 'Relative Speed (opposite direction) = u + v', 'Time to cross platform: T = (Length of Train + Length of Platform) / Speed'],
    source: 'https://www.indiabix.com/aptitude/problems-on-trains/'
  },
  {
    id: 'apt-time-distance',
    title: 'Time and Distance',
    description: 'Calculate speed, time, and distance relations under varying conditions including average speeds and relative motions.',
    focus: ['Speed, time, and distance conversion', 'Average speed calculations', 'Ratio of speeds vs time taken', 'Late and early arrival scenarios'],
    examples: ['A boy walks at 4 km/hr and reaches 5 mins late', 'Find average speed of a car covering unequal distances', 'Ratio of speed of two cars and travel times'],
    tips: ['Speed and Time are inversely proportional for a constant distance: S1/S2 = T2/T1', 'If a person travels equal distances at speeds x and y, the average speed is 2xy/(x+y)', 'Convert units to be consistent before running calculations'],
    formulas: ['Distance = Speed × Time', 'Average Speed (equal distance) = 2xy / (x + y)', 'Average Speed (general) = Total Distance / Total Time', 'Ratio of speeds: If ratio of speeds is a:b, then ratio of times taken is b:a'],
    source: 'https://www.indiabix.com/aptitude/time-and-distance/'
  },
  {
    id: 'apt-height-distance',
    title: 'Height and Distance',
    description: 'Use trigonometric ratios to calculate heights of objects and distances between points from angles of elevation and depression.',
    focus: ['Angles of elevation', 'Angles of depression', 'Shadow and tower problems', 'Multi-point distance calculations'],
    examples: ['Angle of elevation of tower from a point is 30°', 'Angle of depression of a boat from a cliff', 'Calculate height of tree given shadow length'],
    tips: ['Draw a neat right-angled triangle schematic first to map coordinates', 'Memorize common values of sin, cos, and tan for 30°, 45°, and 60°', 'Generally, tan θ is the most frequently used ratio (opposite/adjacent)'],
    formulas: ['tan θ = Height / Base', 'sin θ = Height / Hypotenuse', 'cos θ = Base / Hypotenuse', 'Common values: tan 30° = 1/√3, tan 45° = 1, tan 60° = √3'],
    source: 'https://www.indiabix.com/aptitude/height-and-distance/'
  },
  {
    id: 'apt-time-work',
    title: 'Time and Work',
    description: 'Solve work efficiency, wage allocation, and collaborative work completion problems.',
    focus: ['Work completed by individuals in group', 'Efficiency of workers', 'Wages divided by work share', 'Leaving or joining midway'],
    examples: ['A can do work in 10 days, B in 15 days; find combined time', 'Worker A is twice as efficient as worker B', 'Wages division between A and B who work together'],
    tips: ['If A can do a piece of work in n days, then A\'s 1 day\'s work = 1/n', 'If A is twice as good a workman as B, then A takes half the time taken by B', 'Total Work can be assumed as the LCM of individual days to make calculations simpler'],
    formulas: ['Combined work rate: 1/T = 1/A + 1/B', 'Time taken together: T = (A * B) / (A + B)', 'Work = Efficiency × Time', 'Wages ratio = Ratio of work done = Ratio of efficiencies'],
    source: 'https://www.indiabix.com/aptitude/time-and-work/'
  },
  {
    id: 'apt-simple-interest',
    title: 'Simple Interest',
    description: 'Calculate straightforward interest accumulated over time on a constant principal amount.',
    focus: ['Calculation of basic interest', 'Find Principal, Rate, or Time', 'Sum doubles or triples itself', 'Varying rates over periods'],
    examples: ['Calculate interest on $5000 at 5% rate for 3 years', 'Find time in which principal doubles itself at 10% rate', 'Calculate simple interest for fractional years'],
    tips: ['Principal remains constant throughout the entire tenure in simple interest', 'Interest earned every year is identical', 'Total Amount is the sum of the Principal and the Simple Interest earned'],
    formulas: ['Simple Interest: SI = (P × R × T) / 100', 'Amount: A = P + SI = P(1 + RT/100)', 'Principal: P = (100 × SI) / (R × T)', 'Rate: R = (100 × SI) / (P × T)', 'Time: T = (100 × SI) / (P × R)'],
    source: 'https://www.indiabix.com/aptitude/simple-interest/'
  },
  {
    id: 'apt-compound-interest',
    title: 'Compound Interest',
    description: 'Calculate interest on both initial principal and accumulated interest over successive compounding periods.',
    focus: ['Annual compounding', 'Half-yearly & quarterly compounding', 'Difference between SI and CI', 'Population growth & depreciation'],
    examples: ['Find CI after 3 years compounded annually', 'Quarterly compounding conversion', 'Calculate rate when sum doubles in N years'],
    tips: ['For half-yearly compounding, halve the rate and double the time', 'For quarterly compounding, divide rate by 4 and multiply time by 4', 'Use successive percentage change concept for quick CI calculations'],
    formulas: ['Amount: A = P(1 + R/100)^T', 'Compound Interest: CI = A - P', 'CI - SI (2 years): D = P(R/100)^2', 'CI - SI (3 years): D = P(R/100)^2 * (3 + R/100)'],
    source: 'https://www.indiabix.com/aptitude/compound-interest/'
  },
  {
    id: 'apt-profit-loss',
    title: 'Profit and Loss',
    description: 'Calculate commercial profits, losses, margins, discount rates, and marked price relations.',
    focus: ['Cost Price vs Selling Price', 'Profit% and Loss% calculations', 'Marked Price and Discount%', 'False weights and cheating shopkeepers'],
    examples: ['Buy an article for $200 and sell for $250; calculate profit%', 'Marked price of shirt is discounted by 10%', 'Shopkeeper uses a 900g weight instead of 1kg'],
    tips: ['Profit or Loss is always calculated on Cost Price (CP) unless specified otherwise', 'Discount is always calculated on Marked Price (MP)', 'Selling Price (SP) after discount = MP × (1 - Discount%)'],
    formulas: ['Profit = SP - CP', 'Loss = CP - SP', 'Profit% = (Profit / CP) × 100', 'Loss% = (Loss / CP) × 100', 'SP = CP × (100 + Profit%) / 100', 'MP = SP / (1 - Discount%)'],
    source: 'https://www.indiabix.com/aptitude/profit-and-loss/'
  },
  {
    id: 'apt-partnership',
    title: 'Partnership',
    description: 'Resolve profit distributions among business partners based on capital investments and duration.',
    focus: ['Simple partnership (equal time)', 'Compound partnership (different time)', 'Working and sleeping partners', 'Profit sharing ratios'],
    examples: ['A invests $5000 for 12 months, B invests $6000 for 8 months', 'Determine B\'s share of profit given capital ratios', 'Working partner gets 10% commission before profit split'],
    tips: ['Profit share is directly proportional to both Capital and Time of investment', 'For equal investment periods, Profit Ratio = Capital Ratio', 'For unequal investment periods, Profit Ratio = (Capital1 × Time1) : (Capital2 × Time2)'],
    formulas: ['Profit Ratio (Simple): P1 : P2 = C1 : C2', 'Profit Ratio (Compound): P1 : P2 = C1*T1 : C2*T2', 'Capital ratio calculation: C1 = (P1 / T1)', 'Investment Time calculation: T1 = (P1 / C1)'],
    source: 'https://www.indiabix.com/aptitude/partnership/'
  },
  {
    id: 'apt-percentage',
    title: 'Percentage',
    description: 'Understand fractional scaling, growth/decay, consecutive percent changes, and marks/elections comparison problems.',
    focus: ['Percentage-Fraction conversion', 'Percentage increase & decrease', 'Consecutive percentage change', 'Elections, populations, and exams benchmarks'],
    examples: ['A\'s salary is 20% more than B\'s salary', 'Population of a town increases by 10% annually', 'Candidate gets 40% marks and fails by 10 marks'],
    tips: ['Consecutive increases of x% and y% result in net change of (x + y + xy/100)%', 'If A is x% more than B, then B is [x / (100 + x)] * 100% less than A', 'To express a quantity x as a percentage of y, use (x / y) × 100'],
    formulas: ['Net change%: x + y + (x*y)/100', 'Percent More/Less: [Change / Base] * 100', 'If value increases by R%, new value = Original × (1 + R/100)', 'If A is x% less than B, B is [x / (100 - x)] * 100% more than A'],
    source: 'https://www.indiabix.com/aptitude/percentage/'
  },
  {
    id: 'apt-ages',
    title: 'Problems on Ages',
    description: 'Solve equations involving past, present, and future age ratios and relationships of family members.',
    focus: ['Present, past, and future age equations', 'Ratio of ages after or before N years', 'Sum and product of ages', 'Averaging family age progression'],
    examples: ['Ratio of ages of A and B is 4:5; sum of ages is 36', 'Father\'s age is 3 times son\'s age; after 5 years it becomes 2.5 times', 'Average age of group increases when one joins'],
    tips: ['If the present age is x, then age n years ago was (x - n) and age n years hence will be (x + n)', 'The difference in ages between two people remains constant throughout their lives', 'Represent unknown age variables clearly (e.g., father = F, son = S) to formulate equations'],
    formulas: ['If present age is X, then age after N years = X + N', 'Age N years ago = X - N', 'If present ages are in ratio a:b, represent ages as ax and bx', 'Difference of ages: (Age A - Age B) is constant'],
    source: 'https://www.indiabix.com/aptitude/problems-on-ages/'
  },
  {
    id: 'apt-calendar',
    title: 'Calendar',
    description: 'Solve problems related to days of the week, leap years, odd days, and matching historical or future calendar dates.',
    focus: ['Odd days method', 'Leap year conditions', 'Century odd days', 'Matching calendar years'],
    examples: ['Find the day of the week for a specific historical date', 'Determine if a given century year is a leap year', 'Find the next year with the same calendar'],
    tips: ['Every year divisible by 4 is a leap year, unless it is a century year not divisible by 400', 'An ordinary year has 1 odd day; a leap year has 2 odd days', 'The day of the week repeats after every 7 days (cycle of 7)'],
    formulas: ['1 Ordinary Year = 365 Days = 52 Weeks + 1 Odd Day', '1 Leap Year = 366 Days = 52 Weeks + 2 Odd Days', 'Odd days in century: 100 yrs = 5, 200 yrs = 3, 300 yrs = 1, 400 yrs = 0'],
    source: 'https://www.indiabix.com/aptitude/calendar/'
  },
  {
    id: 'apt-clock',
    title: 'Clock',
    description: 'Analyze relative movement of hour and minute hands, calculate angles between hands, and find clock gain or loss.',
    focus: ['Angle between hour and minute hands', 'Hands overlapping, opposite, and at right angles', 'Faulty clocks gaining or losing time'],
    examples: ['Calculate the angle between hands at 4:20', 'Find the time when hands overlap between 3 and 4', 'Determine correct time for a clock that gains 5 mins per hour'],
    tips: ['The minute hand moves at 6° per minute', 'The hour hand moves at 0.5° per minute', 'The relative speed of the minute hand over the hour hand is 5.5° per minute'],
    formulas: ['Angle between hands: θ = |30H - 5.5M| where H is hours and M is minutes', 'Hands are in opposite directions (180°): θ = 180°', 'Hands are coincident (0°): θ = 0°'],
    source: 'https://www.indiabix.com/aptitude/clock/'
  },
  {
    id: 'apt-average',
    title: 'Average',
    description: 'Calculate central values of lists, handle additions/replacements/removals in data, and solve weighted average problems.',
    focus: ['Simple arithmetic mean', 'Consecutive numbers averages', 'Average speed', 'Addition or exclusion of elements'],
    examples: ['Find new average age after a teacher joins the class', 'Average run rate in cricket matches', 'Average of first N prime numbers'],
    tips: ['The average of an arithmetic progression is simply (First Term + Last Term) / 2', 'When one element is added, the new Sum = (New Count * New Avg) - (Old Count * Old Avg)', 'Use deviation method to make calculation faster'],
    formulas: ['Average = Sum of Observations / Number of Observations', 'Sum of first N natural numbers = N(N + 1) / 2', 'Average speed = 2xy / (x + y) (for equal distance at speeds x and y)'],
    source: 'https://www.indiabix.com/aptitude/average/'
  },
  {
    id: 'apt-area',
    title: 'Area',
    description: 'Compute the 2D surface space of polygons, circles, triangles, and irregular geometric shapes.',
    focus: ['Triangles (Equilateral, Isosceles, Right-angled)', 'Quadrilaterals (Square, Rectangle, Rhombus, Parallelogram, Trapezium)', 'Circle and sectors', 'Paths in gardens and rectangular fields'],
    examples: ['Area of a path inside or outside a rectangular field', 'Find area of sector of a circle', 'Area of a triangle using Heron\'s formula'],
    tips: ['Always convert all dimensions to the same unit before calculating area', 'The diagonal of a square of side "a" is a√2', 'In a right-angled triangle, check if the sides form a Pythagorean triplet (e.g., 3-4-5, 5-12-13) to save time'],
    formulas: ['Rectangle: Area = Length × Breadth', 'Square: Area = side² = d² / 2 (d is diagonal)', 'Triangle: Area = 1/2 × Base × Height = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2', 'Circle: Area = πr², Circumference = 2πr', 'Sector: Area = (θ / 360) × πr²'],
    source: 'https://www.indiabix.com/aptitude/area/'
  },
  {
    id: 'apt-volume-surface',
    title: 'Volume and Surface Area',
    description: 'Compute the 3D storage capacity and surface areas of prisms, cylinders, spheres, cones, and cubes.',
    focus: ['Cuboid and Cube', 'Cylinder and Cone', 'Sphere and Hemisphere', 'Melting and recasting solids (volume balance)'],
    examples: ['Find volume of cylinder of radius 7cm and height 10cm', 'Total surface area of cone given slant height', 'Number of small spheres made by melting a large sphere'],
    tips: ['When a solid is melted and recast into other solids, the total volume remains conserved', 'Lateral/Curved Surface Area excludes the top and bottom faces', 'Always keep dimensions in identical units (e.g. all cm or all m) before calculating'],
    formulas: ['Cuboid: Vol = l*w*h, Total Surface Area = 2(lw + wh + lh)', 'Cube: Vol = a³, Total Surface Area = 6a²', 'Cylinder: Vol = πr²h, Curved Surface Area = 2πrh, Total Surface Area = 2πr(r+h)', 'Cone: Vol = 1/3 * πr²h, Slant Height l = √(r²+h²), Curved Surface Area = πrl', 'Sphere: Vol = 4/3 * πr³, Surface Area = 4πr²'],
    source: 'https://www.indiabix.com/aptitude/volume-and-surface-area/'
  },
  {
    id: 'apt-perm-comb',
    title: 'Permutation and Combination',
    description: 'Apply basic counting principles, arrangements, and selection combinations to solve card, ball, and word-arrangement puzzles.',
    focus: ['Arrangement of letters in a word', 'Selection of players or committees', 'Circular permutations', 'Vowels together vs vowels apart arrangements'],
    examples: ['In how many ways can letters of word "LEADER" be arranged', 'Select 5 members out of 8 men and 4 women', 'Circular seating of 5 people around a table'],
    tips: ['Use Permutations (nPr) when order of items matters (e.g., seating order, letter grids)', 'Use Combinations (nCr) when order does not matter (e.g., forming committees, choosing marbles)', 'For circular permutations of n objects, total ways = (n-1)!'],
    formulas: ['n! = n × (n-1) × ... × 1', 'Permutation: P(n, r) = n! / (n - r)!', 'Combination: C(n, r) = n! / [r! × (n - r)!]', 'Word arrangement with identical letters: n! / (p1! * p2!) where p1, p2 are repetitions'],
    source: 'https://www.indiabix.com/aptitude/permutation-and-combination/'
  },
  {
    id: 'apt-numbers',
    title: 'Numbers',
    description: 'Analyze arithmetic sequences, sum of series, place values, and digit operations.',
    focus: ['Place value and face value of digits', 'Sum of natural, odd, and even series', 'Consecutive number relations', 'Two digit number swaps'],
    examples: ['Sum of all natural numbers between 1 and 100', 'Product of two consecutive even numbers is 168', 'Interchanging digits of a two-digit number changes value by 18'],
    tips: ['A two-digit number with tens digit "x" and units digit "y" is represented as (10x + y)', 'If the digits of the number are interchanged, the new number is (10y + x)', 'The difference between a two-digit number and its reversed form is always divisible by 9'],
    formulas: ['Sum of natural numbers: Σn = n(n+1) / 2', 'Sum of squares: Σn² = n(n+1)(2n+1) / 6', 'Sum of cubes: Σn³ = [n(n+1)/2]²', 'Arithmetic Progression: Tn = a + (n-1)d, Sum = n/2 * (2a + (n-1)d)'],
    source: 'https://www.indiabix.com/aptitude/numbers/'
  },
  {
    id: 'apt-problems-on-numbers',
    title: 'Problems on Numbers',
    description: 'Solve general algebraic and ratio equations derived from descriptive word problems on numbers.',
    focus: ['Fraction and decimal scaling of numbers', 'Ratios and difference equations', 'Multi-step equations on integers', 'Finding unknown variables'],
    examples: ['A number exceeds its two-fifth by 75', 'Difference between a number and its square root', 'Sum of three numbers in a specific ratio'],
    tips: ['Translate english statements directly into algebra step by step (e.g. "exceeds by" means subtraction is equal to difference)', 'Use single variable equations wherever possible to avoid simultaneous equation overhead', 'Test options by plugging them back into constraints to save time during exams'],
    formulas: ['Translate "x is y% of z": x = (y/100)*z', 'Translate "x exceeds y by d": x - y = d', 'Let the fraction be x / y'],
    source: 'https://www.indiabix.com/aptitude/problems-on-numbers/'
  },
  {
    id: 'apt-hcf-lcm',
    title: 'Problems on H.C.F and L.C.M',
    description: 'Solve problems on Highest Common Factors, Least Common Multiples, remainder cycles, and decimal/fraction factorization.',
    focus: ['Product of two numbers formula', 'HCF and LCM of fractions', 'Bells tolling or lights blinking together', 'Find greatest/least number leaving a remainder'],
    examples: ['HCF of two numbers is 11 and LCM is 693', 'Four bells toll together at intervals of 6, 8, 12, 18 seconds', 'Find HCF and LCM of 2/3, 8/9, 16/81'],
    tips: ['HCF is always a factor of LCM', 'For circular cyclic problems (e.g. bells tolling together, runners on track), always calculate the LCM of the intervals', 'For finding the largest number that divides numbers leaving equal remainders, calculate the HCF of their differences'],
    formulas: ['Product Rule: HCF × LCM = Product of the two numbers', 'HCF of Fractions = HCF of Numerators / LCM of Denominators', 'LCM of Fractions = LCM of Numerators / HCF of Denominators'],
    source: 'https://www.indiabix.com/aptitude/problems-on-hcf-and-lcm/'
  },
  {
    id: 'apt-decimal-fraction',
    title: 'Decimal Fraction',
    description: 'Convert recurring decimals, solve decimal division, comparison, and fractional approximation drills.',
    focus: ['Conversion of recurring decimals to vulgar fractions', 'Multiplication and division of decimals', 'Ordering decimals (ascending/descending)', 'Decimal representation shortcuts'],
    examples: ['Convert 0.363636... into a vulgar fraction', 'Divide 0.0024 by 0.012', 'Find the largest fraction among 3/5, 4/7, 8/9'],
    tips: ['For pure recurring decimals, write repeated digits in numerator and write as many 9s in denominator (e.g., 0.36... = 36/99)', 'For mixed recurring decimals, subtract non-repeating digits from total number in numerator (e.g., 0.16... = (16-1)/90 = 15/90)', 'Count total decimal places for multiplication and subtract for division to handle decimals easily'],
    formulas: ['Recurring decimal (pure): 0.a... = a / 9', 'Recurring decimal (mixed): 0.ab... (b repeats) = (ab - a) / 90', 'Division: a / 10^-n = a * 10^n'],
    source: 'https://www.indiabix.com/aptitude/decimal-fraction/'
  },
  {
    id: 'apt-simplification',
    title: 'Simplification',
    description: 'Solve nested mathematical expressions using BODMAS rules and algebraic identities.',
    focus: ['BODMAS/VBODMAS brackets order', 'Algebraic identities for easy division', 'Nested fractions and continued fractions', 'Approximate value calculations'],
    examples: ['Simplify: (a³ - b³) / (a² + ab + b²)', 'Evaluate nested brackets equation with integers', 'Evaluate 1 / (1 + 1 / (1 + 1/2))'],
    tips: ['Always follow VBODMAS: Vinculum (Bar) -> Brackets -> Of -> Division -> Multiplication -> Addition -> Subtraction', 'Recognize algebraic formats to cancel out factors instead of performing large multiplications', 'Solve continued fractions from the bottom to the top step-by-step'],
    formulas: ['BODMAS Order: Bracket, Of, Division, Multiplication, Addition, Subtraction', 'Identity 1: a² - b² = (a - b)(a + b)', 'Identity 2: (a³ - b³) / (a² + ab + b²) = a - b', 'Identity 3: (a³ + b³) / (a² - ab + b²) = a + b'],
    source: 'https://www.indiabix.com/aptitude/simplification/'
  },
  {
    id: 'apt-root',
    title: 'Square Root and Cube Root',
    description: 'Find roots of integers, identify perfect squares, and utilize prime factorization or division tricks.',
    focus: ['Perfect square conditions', 'Unit digits of squares and cubes', 'Square root by long division method', 'Approximations in roots'],
    examples: ['Find square root of 54756', 'Find the smallest number to multiply to make 180 a perfect square', 'Find cube root of 46656'],
    tips: ['A perfect square never ends in digits 2, 3, 7, or 8', 'The number of zeroes at the end of a perfect square is always even', 'Use unit digits to eliminate options (e.g. if root ends in 6, the number must end in 4 or 6)'],
    formulas: ['Square root: √x = y => y² = x', 'Cube root: ³√x = y => y³ = x', 'If √x + √y = a, do not simply add roots; square both sides', 'Properties: √(ab) = √a * √b, √(a/b) = √a / √b'],
    source: 'https://www.indiabix.com/aptitude/square-root-and-cube-root/'
  },
  {
    id: 'apt-surds-indices',
    title: 'Surds and Indices',
    description: 'Manipulate powers, fractional exponents, and irrational radical numbers using laws of indices.',
    focus: ['Laws of indices (multiplication, division, power)', 'Surds and rationalizing denominators', 'Comparing sizes of surds', 'Solving equations with exponential bases'],
    examples: ['Simplify (256)^0.16 × (16)^0.18', 'Rationalize: 1 / (3 + √2)', 'Find the largest surd among ³√4 and ⁴√6'],
    tips: ['When bases are equal, we can equate their exponents: a^x = a^y => x = y', 'To rationalize a denominator containing (a + √b), multiply both numerator and denominator by its conjugate (a - √b)', 'Convert different surd radicals to the same order by taking the LCM of their roots'],
    formulas: ['Indices: a^m × a^n = a^(m+n)', 'Indices: a^m / a^n = a^(m-n)', 'Indices: (a^m)^n = a^(m*n)', 'Surd: Rationalizing factor of (√a + √b) is (√a - √b) since product is a - b', 'Indices: a^-n = 1 / a^n, a^0 = 1'],
    source: 'https://www.indiabix.com/aptitude/surds-and-indices/'
  },
  {
    id: 'apt-ratio-proportion',
    title: 'Ratio and Proportion',
    description: 'Handle proportional divisions, scaling ratios, mean/third/fourth proportionals, and coins composition.',
    focus: ['Combining multiple ratios (A:B and B:C to A:B:C)', 'Mean, third, and fourth proportionals', 'Problems on division of salary, shares, or coins', 'Directly and inversely proportional scaling'],
    examples: ['If A:B = 2:3 and B:C = 4:5; find A:B:C', 'Find the mean proportional of 4 and 16', 'A bag contains 50p, 25p, and 10p coins in ratio 5:9:4'],
    tips: ['To combine A:B and B:C, multiply B in both ratios to make B\'s value equal in both', 'Represent coin values in their rupee equivalent (e.g. 50p = 0.5 Rs) when calculating money totals', 'Ratio division: To divide amount X in ratio a:b, shares are aX/(a+b) and bX/(a+b)'],
    formulas: ['Fourth Proportional of a, b, c is x => a/b = c/x => x = bc/a', 'Third Proportional of a, b is x => a/b = b/x => x = b²/a', 'Mean Proportional of a, b is x => a/x = x/b => x = √(ab)', 'Duplicate Ratio of a:b is a²:b²'],
    source: 'https://www.indiabix.com/aptitude/ratio-and-proportion/'
  },
  {
    id: 'apt-chain-rule',
    title: 'Chain Rule',
    description: 'Apply direct and indirect proportions to solve multi-variable work, cost, and consumption problems.',
    focus: ['Direct proportion', 'Indirect proportion', 'Man-day-hour-work relation', 'Unitary method scaling'],
    examples: ['Calculate food provisions duration for an army camp after reinforcements arrive', 'Find how many workers are needed to complete a project given shifts and hours', 'Cost scaling for bulk industrial items'],
    tips: ['More men can do more work (Direct proportion)', 'More men will take less time to complete the same work (Indirect/Inverse proportion)', 'Always write down variables in columns to easily identify direct/indirect relations before multiplying'],
    formulas: ['Work formula: (M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2 where M = Men, D = Days, H = Hours, W = Work', 'Direct Proportion: x1 / y1 = x2 / y2', 'Inverse Proportion: x1 * y1 = x2 * y2'],
    source: 'https://www.indiabix.com/aptitude/chain-rule/'
  },
  {
    id: 'apt-pipes-cistern',
    title: 'Pipes and Cistern',
    description: 'Solve reservoir loading problems involving inlet pipes, outlet pipes, and tank leakages.',
    focus: ['Inlet pipes filling tank (positive rate)', 'Outlet/Leakage pipes draining tank (negative rate)', 'Alternating open pipe sequences', 'Partially open pipes or delayed shutdowns'],
    examples: ['Pipe A fills tank in 6 hrs, Pipe B empties it in 8 hrs; find combined time', 'A leak empties a full tank in 10 hrs; find filling rate adjustment', 'Two pipes are open and one is closed after 2 hours'],
    tips: ['Inlet pipes perform positive work (+1/A rate); Outlet pipes/leaks perform negative work (-1/B rate)', 'If a pipe fills a tank in A hours, part filled in 1 hour = 1/A', 'If a pipe empties a tank in B hours, part emptied in 1 hour = 1/B'],
    formulas: ['Combined rate: Net Work = 1/A - 1/B (A fills, B empties)', 'Time to fill: T = (A * B) / (B - A) where B > A (emptying rate is slower)', 'Tank capacity = Flow rate × Time'],
    source: 'https://www.indiabix.com/aptitude/pipes-and-cistern/'
  },
  {
    id: 'apt-boats-streams',
    title: 'Boats and Streams',
    description: 'Calculate speed of boats, swimmers, or objects moving along or against a flowing water current.',
    focus: ['Downstream speed (with flow)', 'Upstream speed (against flow)', 'Speed of boat in still water', 'Speed of stream/current'],
    examples: ['Find boat speed in still water given downstream and upstream rates', 'Determine stream speed when a boat takes twice as long upstream than downstream', 'Calculate average speed of round trip'],
    tips: ['Upstream speed is always less than downstream speed', 'Speed of the boat in still water must be greater than the stream speed for upstream movement to occur', 'If speed of boat is u and stream is v, downstream speed is u+v, upstream is u-v'],
    formulas: ['Downstream Speed (d) = u + v', 'Upstream Speed (u_p) = u - v', 'Speed of Boat in Still Water (u) = (d + u_p) / 2', 'Speed of Stream (v) = (d - u_p) / 2'],
    source: 'https://www.indiabix.com/aptitude/boats-and-streams/'
  },
  {
    id: 'apt-alligation-mixture',
    title: 'Alligation or Mixture',
    description: 'Solve problems involving mixing two or more varieties of goods to form a mixture of intermediate cost or concentration.',
    focus: ['Alligation rule for mixing ratios', 'Mean price calculation', 'Replacement of liquid in containers (dilution)', 'Concentration of acid/milk mixtures'],
    examples: ['Find the ratio to mix wheat of different prices to get a target price', 'Determine milk concentration after replacing 10L with water thrice', 'Weighted composition of alloys'],
    tips: ['The alligation cross method is: (Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)', 'The cost of the mixture (Mean Price) must lie between the Cheaper Price and the Dearer Price', 'Keep concentration terms in similar fractions or percentages throughout'],
    formulas: ['Alligation Cross Formula: (Qty of Cheaper) / (Qty of Dearer) = (d - m) / (m - c) where c = cheaper rate, d = dearer rate, m = mean price', 'Repeated Dilution: Final Liquid Quantity = Initial Quantity * (1 - y/x)^n where x = capacity, y = replaced quantity, n = number of operations'],
    source: 'https://www.indiabix.com/aptitude/alligation-or-mixture/'
  },
  {
    id: 'apt-logarithm',
    title: 'Logarithm',
    description: 'Solve exponential equations using logarithmic laws, base changes, and characteristic mantissas.',
    focus: ['Laws of product, quotient, and power in logarithms', 'Change of base formula', 'Logarithms of 0 and 1', 'Common logarithms and natural logarithms bases'],
    examples: ['Evaluate: log_2(32) + log_3(27)', 'Find value of x if log_x(343) = 3', 'Simplify: log(ab/c) + log(c/a)'],
    tips: ['Logarithm is the inverse operation of exponentiation: log_b(x) = y means b^y = x', 'Logarithms of negative numbers and zero are not defined in real numbers', 'The base of a logarithm must be positive and not equal to 1'],
    formulas: ['Product Rule: log_b(M × N) = log_b(M) + log_b(N)', 'Quotient Rule: log_b(M / N) = log_b(M) - log_b(N)', 'Power Rule: log_b(M^k) = k × log_b(M)', 'Base Change: log_b(a) = log_c(a) / log_c(b) = ln(a) / ln(b)', 'Log properties: log_b(b) = 1, log_b(1) = 0'],
    source: 'https://www.indiabix.com/aptitude/logarithm/'
  },
  {
    id: 'apt-races-games',
    title: 'Races and Games',
    description: 'Analyze race starts, dead heats, and competitive timing matches between runners on linear or circular tracks.',
    focus: ['Start distance (A gives B a start of x meters)', 'Start time (A gives B a start of t seconds)', 'Circular tracks meeting points', 'Dead heats (finishing at the same time)'],
    examples: ['In a 100m race, A beats B by 10m or 2 seconds', 'A runs 1.5 times as fast as B; A gives B a start of 30m in 100m race', 'Two runners meet on a circular track for the first time'],
    tips: ['"A gives B a start of x meters" means while A runs the full distance D, B only runs (D - x) meters', '"A gives B a start of t seconds" means B starts running t seconds before A starts', 'If A beats B by x meters, it means when A reaches the finish line, B is still x meters behind'],
    formulas: ['If A beats B by d meters in a race of length L: Ratio of speeds = L / (L - d)', 'Meeting on circular track (opposite direction): Time = Length / (Sa + Sb)', 'Meeting on circular track (same direction): Time = Length / |Sa - Sb|', 'Meeting at starting point: LCM of individual times of one full lap'],
    source: 'https://www.indiabix.com/aptitude/races-and-games/'
  },
  {
    id: 'apt-stocks-shares',
    title: 'Stocks and Shares',
    description: 'Calculate stock dividends, investment yields, buying/selling face and market values, and brokerage commissions.',
    focus: ['Face Value (FV) vs Market Value (MV)', 'Dividend rate vs yield rate', 'Brokerage added to buying price / subtracted from selling price', 'Income/return from stock purchases'],
    examples: ['Invest $9600 in 10% stock at 96; find dividend income', 'Find yield rate of a 12% stock bought at 120', 'Calculate cost of buying stock when brokerage is 0.25%'],
    tips: ['Dividend is always calculated on the Face Value (Nominal Value) of the stock', 'Market Value is the price at which the stock is bought or sold in the market', 'Brokerage is added to MV when buying shares, and subtracted from MV when selling shares'],
    formulas: ['Income (Dividend) = Number of Shares × FV × Dividend%', 'Number of Shares = Total Investment / Buying Price of one share', 'Yield (Rate of Interest) = (Annual Income / Total Investment) × 100%', 'Cost of 1 share = Market Value + Brokerage'],
    source: 'https://www.indiabix.com/aptitude/stocks-and-shares/'
  },
  {
    id: 'apt-probability',
    title: 'Probability',
    description: 'Calculate likelihoods of events using sample spaces, coin tosses, card draws, and dice rolls.',
    focus: ['Coin tossing sample space', 'Dice rolling probabilities', 'Pack of 52 cards classifications', 'Independent and dependent events'],
    examples: ['Probability of getting at least 2 heads when 3 coins are tossed', 'Probability of drawing an ace or a spade from a pack of cards', 'Two dice are rolled; find probability that sum is 7'],
    tips: ['Probability of an event always lies between 0 (impossible) and 1 (certain)', 'Sum of all probabilities in a sample space is always 1', 'Memorize card deck composition: 4 suits of 13 cards each (2 red suits: hearts, diamonds; 2 black suits: spades, clubs; 12 face cards: jacks, queens, kings)'],
    formulas: ['Probability: P(E) = Number of Favorable Outcomes / Total Outcomes', 'Odds in favor of event E = favorable / unfavorable = P(E) / [1-P(E)]', 'Complementary Event: P(E\') = 1 - P(E)', 'Addition Rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'],
    source: 'https://www.indiabix.com/aptitude/probability/'
  },
  {
    id: 'apt-true-discount',
    title: 'True Discount',
    description: 'Calculate Present Worth, True Discount, and Simple Interest differences on future due amounts.',
    focus: ['Present Worth (PW) definition', 'Calculation of True Discount (TD)', 'Relation between TD, PW, and Amount', 'SI on PW equals True Discount'],
    examples: ['Find true discount on $10500 due in 9 months at 8% per annum', 'Find the present worth of a sum of $1100 due in 2 years at 5% interest', 'Calculate interest on present worth'],
    tips: ['True Discount (TD) is the simple interest on the Present Worth (PW) for the unexpired time', 'Amount (A) due in the future is equal to the Present Worth plus the True Discount', 'Present Worth is the actual value of a future sum if paid today at a given interest rate'],
    formulas: ['Present Worth: PW = (100 × Amount) / (100 + R × T)', 'True Discount: TD = Amount - PW = (PW × R × T) / 100 = (Amount × R × T) / (100 + R × T)', 'SI on PW: TD is Simple Interest on PW', 'Relation: PW = (100 × TD) / (R × T)'],
    source: 'https://www.indiabix.com/aptitude/true-discount/'
  },
  {
    id: 'apt-bankers-discount',
    title: "Banker's Discount",
    description: 'Calculate True Discount, Banker\'s Discount, Banker\'s Gain, and Present Worth of bills due in the future.',
    focus: ['Present Worth and True Discount', 'Banker\'s Discount vs True Discount', 'Banker\'s Gain', 'Face Value of bills'],
    examples: ['Find the present worth of a bill due in 6 months at a given interest rate', 'Calculate Banker\'s Discount and Banker\'s Gain on a bill of face value F', 'Calculate True Discount on a bill of face value F'],
    tips: ['Banker\'s Discount (BD) is simple interest on the Face Value for the unexpired time', 'True Discount (TD) is simple interest on the Present Worth for the unexpired time', 'Banker\'s Gain (BG) is the difference between Banker\'s Discount and True Discount, which equals Simple Interest on the True Discount'],
    formulas: ['Present Worth: PW = (100 * Amount) / (100 + R * T)', 'True Discount: TD = (PW * R * T) / 100 = (Amount * R * T) / (100 + R * T)', 'Banker\'s Discount: BD = (Amount * R * T) / 100', 'Banker\'s Gain: BG = BD - TD = Simple Interest on TD = (TD * R * T) / 100 = TD^2 / PW'],
    source: 'https://www.indiabix.com/aptitude/bankers-discount/'
  }
];

export const reasoningTopics = [
  {
    id: 'reason-logical-1',
    title: 'Logical Reasoning',
    description: 'Syllogisms, truth tables, propositions, logical deductions, Venn diagrams and set reasoning.',
    focus: ['Syllogisms', 'Venn diagrams', 'Inference rules', 'Truth tables'],
    examples: ['All/Some/No statements', 'Negation based elimination', 'Set overlap questions'],
    tips: ['Draw Venn diagrams to visualize set relations', 'Apply De Morgan’s laws for negations'],
    formulas: ['De Morgan: ¬(A∧B)=¬A∨¬B', 'Implication: A→B = ¬A∨B']
  },
  {
    id: 'reason-puzzle-1',
    title: 'Puzzles & Arrangement',
    description: 'Seating arrangements, scheduling, ordering, binary puzzles and constraint satisfaction techniques.',
    focus: ['Seating', 'Scheduling', 'Ordering', 'Constraint solving'],
    examples: ['Linear arrangement puzzle', 'Circular seating', 'Slot-based scheduling'],
    tips: ['Use graph representations for seating constraints', 'Apply backtracking for arrangement enumeration'],
    formulas: ['Permutation count: n! for distinct arrangements']
  },
  {
    id: 'reason-pattern-1',
    title: 'Pattern & Series',
    description: 'Number and letter series, matrix patterns, sequence completion and pattern recognition strategies.',
    focus: ['Numeric series', 'Alphabet series', 'Matrix patterns', 'Sequence completion'],
    examples: ['Difference patterns', 'Alternating operations', 'Missing term logic'],
    tips: ['Identify common differences or ratios', 'Check for alternating sequences'],
    formulas: ['Arithmetic difference: a_n = a_1 + (n-1)d', 'Geometric ratio: a_n = a_1 * r^{n-1}']
  },
  {
    id: 'reason-analogy-1',
    title: 'Analogies & Classification',
    description: 'Word analogies, odd-one-out, classification, category mapping and relationship identification.',
    focus: ['Analogies', 'Odd one out', 'Classification', 'Relationship mapping'],
    examples: ['Word pair relations', 'Category grouping', 'Image or shape classification'],
    tips: ['Map analogies to relational templates (A:B :: C:D)', 'Group items by shared attributes'],
    formulas: ['Analogy structure: A is to B as C is to D']
  },
  {
    id: 'reason-blood-1',
    title: 'Blood Relations & Family Trees',
    description: 'Family relation puzzles, symbolic representation of relationships and generational mapping.',
    focus: ['Parent/child mapping', 'In-law relations', 'Gender neutral logic', 'Relation inference'],
    examples: ['Find relation between two members', 'Multi-step family mapping'],
    tips: ['Start from the known relation and work outward', 'Use generational hierarchy diagrams'],
    formulas: []
  },
  {
    id: 'reason-coding-1',
    title: 'Coding-Decoding & Symbol Series',
    description: 'Character or number substitution rules, code pattern extraction, and reversible transforms.',
    focus: ['Substitution rules', 'Reversible codes', 'Position-based mapping', 'Symbol arithmetic'],
    examples: ['Find original word from code', 'Apply shift-based coding'],
    tips: ['Look for consistent character shifts', 'Consider substitution ciphers like Caesar'],
    formulas: []
  },
  {
    id: 'reason-input-1',
    title: 'Input-Output & Machine Logic',
    description: 'Sequential transformation steps applied to strings or numbers; track the pipeline to deduce rules.',
    focus: ['Stepwise transforms', 'Pattern deduction', 'Reverse engineering steps', 'Index mapping'],
    examples: ['Series of operations on numbers', 'String transformation pipelines'],
    tips: ['Trace each operation stepwise', 'Maintain a mapping of input to output'],
    formulas: []
  },
  {
    id: 'reason-direction-1',
    title: 'Directions, Distances & Mapping',
    description: 'Compass directions, left-right turns, shortest path reasoning and grid-based mapping.',
    focus: ['Compass logic', 'Relative movement', 'Coordinate tracking', 'Shortest path reasoning'],
    examples: ['Find final position after moves', 'Minimum steps on grid'],
    tips: ['Use vector addition for direction steps', 'Apply Manhattan distance for grid moves'],
    formulas: ['Distance = |Δx| + |Δy|']
  },
  {
    id: 'reason-data-suff-1',
    title: 'Data Sufficiency & Decision Questions',
    description: 'Evaluate whether provided statements are sufficient to answer a question — common in many competitive and bank exams.',
    focus: ['Statement analysis', 'Sufficiency rules', 'Elimination strategy', 'Practice classification'],
    examples: ['Determine sufficiency combinations', 'Minimal statement identification'],
    tips: ['Identify the minimal set of statements needed', 'Apply logical deduction to eliminate excess'],
    formulas: []
  }
];

export const verbalTopics = [
  {
    id: 'verb-grammar-1',
    title: 'Grammar & Usage',
    description: 'Parts of speech, subject-verb agreement, tenses, modifiers, prepositions and common error spotting.',
    focus: ['Subject-verb agreement', 'Tenses', 'Modifiers', 'Error spotting'],
    examples: ['Identify the wrong tense', 'Choose correct article', 'Fix modifier placement'],
    tips: ['Check subject-verb agreement first', 'Ensure article matches noun count'],
    formulas: []
  },
  {
    id: 'verb-vocab-1',
    title: 'Vocabulary & Word Usage',
    description: 'Synonyms, antonyms, word roots, prefixes/suffixes, collocations and contextual meanings.',
    focus: ['Roots', 'Collocations', 'Context words', 'Synonyms/antonyms'],
    examples: ['Prefix/suffix meaning', 'Word substitution', 'Context-based vocabulary'],
    tips: ['Identify root words to infer meaning', 'Use collocations for natural usage'],
    formulas: []
  },
  {
    id: 'verb-reading-1',
    title: 'Reading Comprehension',
    description: 'Passage reading, main idea identification, inference, tone, and question answering strategies.',
    focus: ['Main idea', 'Inference', 'Tone', 'Fact vs opinion'],
    examples: ['Short and long passages', 'Tone detection', 'Author intent questions'],
    tips: ['Skim for main idea before details', 'Notice tone markers like adjectives'],
    formulas: []
  },
  {
    id: 'verb-para-1',
    title: 'Para Jumbles & Sentence Completion',
    description: 'Paragraph ordering, sentence insertion, fill-in-the-blanks and coherence-based tasks.',
    focus: ['Paragraph order', 'Sentence insertion', 'Fill in the blanks', 'Coherence'],
    examples: ['Opening and closing sentence logic', 'Connector clues', 'Flow-based ordering'],
    tips: ['Identify logical connectors', 'Maintain paragraph coherence'],
    formulas: []
  },
  {
    id: 'verb-summary-1',
    title: 'Summary & Note Making',
    description: 'Short summary selection, note writing and compact representation of dense passages.',
    focus: ['Condense ideas', 'Key points', 'Elimination', 'Concise writing'],
    examples: ['Choose the best summary', 'Write a bullet note', 'Remove redundant phrases'],
    tips: ['Capture key ideas in concise sentences', 'Eliminate filler words'],
    formulas: []
  },
  {
    id: 'verb-idioms-1',
    title: 'Idioms, Phrases & Collocations',
    description: 'Common idioms, fixed expressions, phrasal verbs and collocations used in formal writing and interviews.',
    focus: ['Phrasal verbs', 'Common idioms', 'Collocations', 'Usage practice'],
    examples: ['Choose correct idiom', 'Replace with appropriate phrasal verb'],
    tips: ['Match idiom meaning to context', 'Use common phrasal verbs for fluency'],
    formulas: []
  },
  {
    id: 'verb-sentence-1',
    title: 'Sentence Correction & Error Spotting',
    description: 'Identify grammatical and idiomatic errors in sentences and apply concise corrections.',
    focus: ['Subject-verb agreement', 'Modifier placement', 'Article usage', 'Parallel structure'],
    examples: ['Fix tense mismatch', 'Correct misplaced modifier'],
    tips: ['Ensure verb tense matches time reference', 'Place modifiers next to the words they modify'],
    formulas: []
  },
  {
    id: 'verb-speech-1',
    title: 'Direct & Indirect Speech',
    description: 'Conversion between direct and indirect speech, tense backshifts, and reporting verbs.',
    focus: ['Backshifting rules', 'Reporting verbs', 'Pronoun adjustments', 'Time expression changes'],
    examples: ['Convert direct to indirect', 'Handle question forms in indirect speech'],
    tips: ['Shift tenses back one step', 'Adjust pronouns and time expressions'],
    formulas: []
  },
  {
    id: 'verb-voice-1',
    title: 'Active & Passive Voice',
    description: 'Transform sentences between active and passive voice and maintain correct agent/subject relationships.',
    focus: ['Agent omission', 'Tense preservation', 'Passive forms', 'Two-object verbs'],
    examples: ['Convert to passive preserving meaning', 'Choose appropriate passive structure'],
    tips: ['Identify the object to become subject', 'Maintain tense consistency'],
    formulas: []
  },
  {
    id: 'verb-cloze-1',
    title: 'Cloze Tests & Fill-in-the-blanks',
    description: 'Context-based gap filling, collocation checks and discourse-level coherence for blank-filling tasks.',
    focus: ['Context clues', 'Collocation fit', 'Discourse markers', 'Grammar fit'],
    examples: ['Choose correct preposition', 'Select best discourse connector'],
    tips: ['Use context clues to select prepositions', 'Link sentences with appropriate connectors'],
  }
];

export const dsaTopics = [
  {
    id: 'dsa-arrays',
    title: 'Arrays',
    description: 'Core linear structures and frequency-based problem solving.',
    questions: arrayProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url === '#' ? 'https://leetcode.com/problemset/all/' : p.url
    }))
  },
  {
    id: 'dsa-strings',
    title: 'Strings',
    description: 'String manipulation, matching, character frequencies, and palindrome checks.',
    questions: [
      { id: '401', title: 'Reverse String', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-string/' },
      { id: '402', title: 'Valid Palindrome', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: '403', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: '404', title: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
      { id: '405', title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/' }
    ]
  },
  {
    id: 'dsa-linkedlist-stack',
    title: 'Linked List & Stack',
    description: 'Pointer manipulation and last-in-first-out workflows.',
    questions: [
      { id: '101', title: 'Reverse a Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: '102', title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: '103', title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: '104', title: 'Min Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/min-stack/' }
    ]
  },
  {
    id: 'dsa-trees-recursion',
    title: 'Trees & Recursion',
    description: 'Depth-first thinking, traversal patterns, and divide-and-conquer.',
    questions: [
      { id: '201', title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: '202', title: 'Invert Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: '203', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: '204', title: 'Path Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/path-sum/' }
    ]
  },
  {
    id: 'dsa-graphs-dp',
    title: 'Graphs & DP',
    description: 'Connectivity, shortest path, and memoized optimization.',
    questions: [
      { id: '301', title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: '302', title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
      { id: '303', title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '304', title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' }
    ]
  },
  {
    id: 'dsa-pointers',
    title: 'Pointers',
    description: 'Reference manipulation, two-pointer iteration, and sliding window baselines.',
    questions: [
      { id: '501', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: '502', title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
      { id: '503', title: 'Container With Most Water', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: '504', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: '505', title: 'Move Zeroes', difficulty: 'Easy', url: 'https://leetcode.com/problems/move-zeroes/' }
    ]
  },
  {
    id: 'dsa-bitwise',
    title: 'Bitwise Operations',
    description: 'Manipulating individual bits, bit masking, fast operations, and bitwise logic tricks.',
    questions: [
      { id: '601', title: 'Number of 1 Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/number-of-1-bits/' },
      { id: '602', title: 'Counting Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/counting-bits/' },
      { id: '603', title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/' },
      { id: '604', title: 'Single Number II', difficulty: 'Medium', url: 'https://leetcode.com/problems/single-number-ii/' },
      { id: '605', title: 'Single Number III', difficulty: 'Medium', url: 'https://leetcode.com/problems/single-number-iii/' },
      { id: '606', title: 'Reverse Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-bits/' },
      { id: '607', title: 'Power of Two', difficulty: 'Easy', url: 'https://leetcode.com/problems/power-of-two/' },
      { id: '608', title: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/' },
      { id: '609', title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/' },
      { id: '610', title: 'Bitwise AND of Numbers Range', difficulty: 'Medium', url: 'https://leetcode.com/problems/bitwise-and-of-numbers-range/' },
      { id: '611', title: 'Sum of Two Integers', difficulty: 'Medium', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { id: '612', title: 'Minimum Flips to Make a OR b Equal to c', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/' },
      { id: '613', title: 'Maximum XOR of Two Numbers in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' }
    ]
  },
  {
    id: 'dsa-slidingwindow',
    title: 'Sliding Window',
    description: 'Subarray/substring operations using fixed-size or dynamic windows to optimize O(N²) brute force down to O(N).',
    questions: [
      { id: '701', title: 'Maximum Average Subarray I', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
      { id: '702', title: 'Minimum Size Subarray Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
      { id: '703', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: '704', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: '705', title: 'Permutation in String', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: '706', title: 'Find All Anagrams in a String', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' },
      { id: '707', title: 'Sliding Window Maximum', difficulty: 'Hard', url: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: '708', title: 'Minimum Window Substring', difficulty: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: '709', title: 'Fruit Into Baskets', difficulty: 'Medium', url: 'https://leetcode.com/problems/fruit-into-baskets/' },
      { id: '710', title: 'Max Consecutive Ones III', difficulty: 'Medium', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
      { id: '711', title: 'Defuse the Bomb', difficulty: 'Easy', url: 'https://leetcode.com/problems/defuse-the-bomb/' },
      { id: '712', title: 'Count Number of Nice Subarrays', difficulty: 'Medium', url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/' }
    ]
  }
];

export const panelAccent = ['bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)]', 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)]', 'bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary)]'];
